
          Bluepill.application('paleio') do |app|
            app.process('development_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb development 4802'
              process.pid_file = '/root/p/tmp/pids/paleio_channel_development_1332741536.pid'
              process.daemonize = true
            end
            app.process('test_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb test 4291'
              process.pid_file = '/root/p/tmp/pids/paleio_channel_test_1332741536.pid'
              process.daemonize = true
            end
            app.process('bras_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb bras 3553'
              process.pid_file = '/root/p/tmp/pids/paleio_channel_bras_1332741536.pid'
              process.daemonize = true
            end
            app.process('almoco_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb almoco 4657'
              process.pid_file = '/root/p/tmp/pids/paleio_channel_almoco_1332741536.pid'
              process.daemonize = true
            end
          end
        
