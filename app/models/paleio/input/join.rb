module Paleio

  module Input

    class Join < Paleio::Input::Base

      after_create :broadcast

      def as_json(options = {})
        { :type => 'join', :id => self.id, :timestamp => self.created_at.to_i * 1000, :channel_id => self.channel_id, :nick => self.nick }
      end

    end

  end

end
