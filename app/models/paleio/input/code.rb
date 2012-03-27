module Paleio

  module Input

    class Code < Paleio::Input::Base

      validates_presence_of :raw, :code_language
      validates_inclusion_of :paste, :in => [true,false]

      private
      def broadcast
        @@redis.publish("channel_#{self.channel.code}", { :type => 'code', :code => {
            :code => self.raw, :timestamp => self.created_at.to_i * 1000, :nick => self.nick,
            :language => self.code_language
        } }.to_json)
        true
      end

    end

  end

end
