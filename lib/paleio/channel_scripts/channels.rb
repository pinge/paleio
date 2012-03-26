
          Bluepill.application('paleio') do |app|
            app.process('teste_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb teste 3837'
              process.pid_file = '/root/paleio/tmp/pids/paleio_channel_teste_1332737147.pid'
              process.daemonize = true
            end
            app.process('ze_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/p/socket_server.rb ze 3035'
              process.pid_file = '/root/paleio/tmp/pids/paleio_channel_ze_1332737147.pid'
              process.daemonize = true
            end
          end
        
