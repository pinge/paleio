module Paleio

  module Input

    class Code < Paleio::Input::Base

      validates_presence_of :raw, :code_language
      validates_inclusion_of :paste, :in => [true,false]
      after_create :broadcast

      def as_json(options = {})
        {
            :type => 'code', :id => self.id, :code => self.raw, :timestamp => self.created_at.to_i * 1000,
            :paste => self.paste, :language => self.code_language, :channel_id => self.channel_id, :nick => self.nick
        }
      end

    end

  end

end
