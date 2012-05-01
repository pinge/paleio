module Paleio

  module Input

    class Text < Paleio::Input::Base

      validates_presence_of :raw
      validates_inclusion_of :paste, :in => [true,false]
      after_create :broadcast

      def as_json(options = {})
        {
            :type => 'text', :id => self.id, :text => self.raw, :timestamp => self.created_at.to_i * 1000,
            :paste => self.paste, :channel_id => self.channel_id, :nick => self.nick
        }
      end

    end

  end

end
