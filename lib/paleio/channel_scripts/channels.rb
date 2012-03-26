
          Bluepill.application('paleio') do |app|
            app.process('teste_channel') do |process|
              process.start_command = '/usr/local/rvm/rubies/ruby-1.9.2-p290/bin/ruby /root/paleio/socket_server.rb teste 3837'
              process.pid_file = '/root/paleio/tmp/pids/paleio_channel_teste_1332733112.pid'
              process.daemonize = true
            end
          end
        