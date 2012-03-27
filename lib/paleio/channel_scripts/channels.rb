
          Bluepill.application('paleio') do |app|
            app.process('test_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb test 3025'
              process.pid_file = '/root/p/tmp/pids/paleio_channel_test_1332832075.pid'
              process.daemonize = true
            end
            app.process('asdf_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb asdf 3913'
              process.pid_file = '/root/p/tmp/pids/paleio_channel_asdf_1332832075.pid'
              process.daemonize = true
            end
          end
        