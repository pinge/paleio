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
      ws.onopen do # client joins
        puts 'creating socket'
        #ws.send({ :type => 'join' }.to_json);
        SOCKETS << ws # When someone connects I want to add that socket to the SOCKETS array that I instantiated above
      end
      ws.onclose do
        puts 'closing socket'
        SOCKETS.delete ws # Upon the close of the connection I remove it from my list of running sockets
      end
      ws.onerror do |error|
        ap error
      end
      ws.onmessage do |msg|
        ap msg
        SOCKETS.each {|s| s.send msg}
      end
    end
  end
end

# Creating a thread for the Redis subscribe block
Thread.new do
  @redis.subscribe("channel_#{channel_code}") do |on|
    on.message do |chan, msg| # When a message is published to 'channel_code'
     puts "sending message: #{msg}"
     SOCKETS.each {|s| s.send msg} # Send out the message on each open socket
    end
  end
end

sleep