
          Bluepill.application('paleio') do |app|
            app.process('asdf_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/paleio/socket_server.rb asdf 3105'
              process.pid_file = '/root/paleio/tmp/pids/paleio_channel_asdf_1333192224.pid'
              process.daemonize = true
            end
          end
