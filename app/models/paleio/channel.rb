module Paleio

  class Channel < ActiveRecord::Base

    PORT_RANGE = [3000,5000] # _maximum_ number of websocket servers in this host

    set_table_name 'channels'
    has_many :inputs,         :class_name => 'Paleio::Input::Base',           :foreign_key => 'channel_id'
    has_many :join_inputs,    :class_name => 'Paleio::Input::Join',           :foreign_key => 'channel_id'
    has_many :file_inputs,    :class_name => 'Paleio::Input::File',           :foreign_key => 'channel_id'
    has_many :journals,       :class_name => 'Paleio::Journal',         :foreign_key => 'channel_id'
    validates_presence_of :name, :code, :account_id, :current_host, :current_port
    validates_uniqueness_of :current_port
    validates_uniqueness_of :code, :scope => [:account_id], :message => 'already exists'
    validates_format_of :code, :with => /[a-z_]/
    after_create :start_websocket_server
    before_validation :set_current_host, :on => :create
    before_validation :set_current_port, :on => :create

    def add_journal_entry(raw_entry)
      journal = self.journal_for(raw_entry.created_at.year, raw_entry.created_at.month, raw_entry.created_at.day)
      journal.add_entry(raw_entry)
    end

    def journal_for(y,m,d)
      existing_journal = self.journals.where('year = ? AND month = ? AND day = ?', y, m, d).first
      existing_journal ||= self.journals.create!({ :account_id => self.account_id, :year => y, :month => m, :day => d })
    end

    def last_activity_by(user)
      (self.inputs.where("created_by = ?", user).order('created_at DESC').first.created_at rescue nil)
    end

    # TODO not working _at least_ when running rake db:migrate
    def self.is_port_open?(ip, port)
      require 'timeout'
      require 'socket'
      begin
        Timeout::timeout(2) do
          begin
            socket = TCPSocket.new(ip, port)
            socket.close
            return true
          rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH
            return false
          end
        end
      rescue Timeout::Error
      end
      return false
    end

    private
    def set_current_host
      self.current_host = '0.0.0.0' unless self.current_host # bind to all interfaces if no address is set
      true
    end

    def set_current_port
      port_range_size = PORT_RANGE.last - PORT_RANGE.first
      while self.class.all.select{ |c| c.current_port > PORT_RANGE.first and c.current_port < PORT_RANGE.last }.size < port_range_size
        random_port = PORT_RANGE.first + rand(port_range_size)
        # TODO solve possible loop: ports number < port range size and the other available ports are already in use
        ap [random_port, self.class.exists?(:current_port => random_port), self.class.is_port_open?(self.current_host, random_port)]
        if !self.class.exists?(:current_port => random_port) #and self.class.is_port_open?(self.current_host, random_port)
          self.current_port = random_port
          return true
        end
      end
      false
    end

    def start_websocket_server
      ruby_bin = "#{ENV['MY_RUBY_HOME']}/bin/ruby"
      script = "
          Bluepill.application('paleio', { :base_dir => '/tmp/paleio', :log_file => '/tmp/paleio.log' }) do |app|"
      self.class.all.each do |channel|
        script += "
            app.process('#{channel.code}_channel') do |process|
              process.start_command = '#{ruby_bin} #{Rails.root}/socket_server.rb #{channel.code} #{channel.current_port}'
              process.pid_file = '/tmp/paleio/pids/paleio_channel_#{channel.code}_#{Time.zone.now.to_i}.pid'
              process.daemonize = true
            end"
      end
      script += "
          end
        "
      result = File.open("#{Rails.root}/lib/paleio/channel_scripts/channels.rb", 'w'){ |f| f.write(script) }
      if result > 0
        status = Open4::popen4("bash") do |pid, stdin, stdout, stderr|
          # in /etc/sudoers, nodoby should have an entry with NOPASSWD set for this to work under Apache Passenger
          # in /etc/passwd, nobody's entry should have /bin/bash as shell (so rvm can be executed)
          # (Apache User and Group were set to www-data) -> executing 'whoami' in a bash shell using popen4 returns 'nobody'
          stdin.puts "bluepill --base-dir /tmp/paleio --logfile /tmp/paleio.log --no-privileged quit; pkill -9 -f socket_server.rb; bluepill --base-dir /tmp/paleio --logfile /tmp/paleio.log --no-privileged load #{Rails.root}/lib/paleio/channel_scripts/channels.rb"
          stdin.close
        end
      end
      true
    end

  end

end
