
          Bluepill.application('paleio') do |app|
            app.process('test_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/paleio/socket_server.rb test 4300'
              process.pid_file = '/root/paleio/tmp/pids/paleio_channel_test_1332984734.pid'
              process.daemonize = true
            end
          end
        