module Paleio

  module Input

    class Join < Paleio::Input::Base

      #def as_json(options = {})
      #  {
      #      :id => self.id, :input => self.raw, :timestamp => self.created_at.to_i * 1000, :paste => self.paste, :is_code => self.is_code?,
      #      :code_language => self.code_language, :channel_id => self.channel_id, :nick => self.nick
      #  }
      #end

      private
      def broadcast
        Rails.logger.info "channel_#{self.channel.code}"
        @@redis.publish("channel_#{self.channel.code}", { :type => 'join', :join => {
            :nick => self.nick, :timestamp => self.created_at.to_i * 1000
        } }.to_json)
        true
      end

    end

  end

end
