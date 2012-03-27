module Paleio

  module Input

    class Text < Paleio::Input::Base

      validates_presence_of :raw
      validates_inclusion_of :paste, :in => [true,false]

      private
      def broadcast
        Rails.logger.ap 'text'
        @@redis.publish("channel_#{self.channel.code}", { :type => 'text', :text => {
            :text => self.raw, :timestamp => self.created_at.to_i * 1000, :nick => self.nick
        } }.to_json)
        true
      end

    end

  end

end
