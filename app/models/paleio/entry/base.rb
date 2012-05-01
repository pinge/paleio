module Paleio

  module Entry

    class Base < ActiveRecord::Base

      set_table_name 'entries'

      belongs_to :journal,          :class_name => 'Paleio::Journal',         :foreign_key => 'journal_id'
      validates_presence_of :journal_id, :nickname, :created_by

      #def as_json(options = {})
      #  {
      #      :id => self.id, :input => self.raw, :timestamp => self.created_at.to_i * 1000, :paste => self.paste, :is_code => self.is_code?,
      #      :code_language => self.code_language, :channel_id => self.channel_id, :nick => self.nick
      #  }
      #end

      private

    end

  end

end