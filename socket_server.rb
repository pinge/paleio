require 'ap'
require 'json'
require 'socket'
require 'timeout'
require 'redis'
require 'em-websocket'
#require 'active_record'
#require 'ap'

def error(msg)
  puts "#{msg}\n\n"
  exit -1
end

websocket_server_host = '0.0.0.0'
redis_host = '0.0.0.0'
redis_port = '6379'
port_range = [3000,5000]

def is_port_open?(ip, port)
  begin
    Timeout::timeout(1) do
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

error("usage: ruby #{__FILE__} channel_name [port:#{port_range.join('-')}]") unless [1,2].include?(ARGV.size)

channel_code = ARGV.first

if ARGV.size > 1
  error("paleio: invalid port number") unless ARGV.last =~ /^[0-9]+$/
  port = ARGV.last.to_i
  error("paleio: port not in range [#{port_range.join('-')}]") unless port >= port_range.first and port <= port_range.last
else
  port = port_range.first + rand(port_range.last - port_range.first)
  error("paleio: random port #{port} is use") if is_port_open?(websocket_server_host, port)
end

SOCKETS = []
CURRENT_USERS = {}

puts "paleio: connecting to redis"
@redis = Redis.new(:host => '127.0.0.1', :port => 6379)

#puts "paleio: fetching channel data"
#ActiveRecord::Base.establish_connection(YAML.load(File.open('config/database.yml'))['development'])
#class Channel < ActiveRecord::Base; set_table_name 'channels' end
#@channel = Channel.find_by_code(channel_code)

puts "paleio: initializing WebSocket server for channel '#{channel_code}' on #{websocket_server_host}:#{port}"
# Creating a thread for the EM event loop
Thread.new do
  EventMachine.run do
    # Creates a websocket listener
    EventMachine::WebSocket.start(:host => websocket_server_host, :port => port) do |ws|

      def broadcast_current_users
        current_users_message = { :type => 'current_users', :users => [] }
        CURRENT_USERS.sort{ |a,b| a.last[:nick] <=> b.last[:nick] }.each do |email,user|
          current_users_message[:users] << { :email => email, :nick => user[:nick] }
        end
        SOCKETS.each{ |socket| socket.send(current_users_message.to_json) }
      end

      ws.onopen do # client joins
        p "paleio onopen: #{ws.object_id}"
        SOCKETS << ws # When someone connects I want to add that socket to the SOCKETS array that I instantiated above
        #broadcast_current_users
      end

      ws.onclose do
        existing_user = CURRENT_USERS.detect{ |email,user| user[:socket_object_ids].detect{ |sid| sid == ws.object_id } }
        if existing_user
          existing_user.last[:socket_object_ids].delete(ws.object_id)
          if existing_user.last[:socket_object_ids].empty?
            CURRENT_USERS.delete existing_user.first
            broadcast_current_users
          end
        else
        end
        SOCKETS.delete ws # Upon the close of the connection I remove it from my list of running sockets
      end

      ws.onerror do |error|
        # TODO handle on error
        # TODO handle accented characters
        # <EventMachine::WebSocket::WebSocketError: Data sent to WebSocket must be valid UTF-8 but was ASCII-8BIT (valid: true)>
        ap error
      end

      ws.onmessage do |msg|
        message = JSON.parse(msg)
        if ['ping'].include?(message['type'])
          nick = message['nick']
          email = message['email']
          if CURRENT_USERS.include?(email)
            CURRENT_USERS[email][:socket_object_ids] << ws.object_id
            CURRENT_USERS[email][:last_activity] = Time.now.to_i
          else
            CURRENT_USERS[email] = { :socket_object_ids => [ws.object_id], :nick => nick, :last_activity => Time.now.to_i }
          end
          broadcast_current_users
        elsif ['join'].include?(message['type'])
          if message['join'].include?('email') and message['join']['email'] != ''
            nick = message['join']['nick']
            email = message['join']['email']
            if CURRENT_USERS.include?(email)
              CURRENT_USERS[email][:socket_object_ids] << ws.object_id
              CURRENT_USERS[email][:last_activity] = Time.now.to_i
            else
              CURRENT_USERS[email] = { :socket_object_ids => [ws.object_id], :nick => nick, :last_activity => Time.now.to_i }
              broadcast_current_users
            end
          else
          end
        else
          SOCKETS.each {|s| s.send msg}
        end
      end

    end
  end
end

# Creating a thread for the Redis subscribe block
Thread.new do
  @redis.subscribe("channel_#{channel_code}") do |on|
    on.message do |chan, msg| # When a message is published to 'channel_code'
      SOCKETS.each {|s| s.send msg} # Send out the message on each open socket
    end
  end
end

sleep
