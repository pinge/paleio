module Paleio

  module Input

    class Base < ActiveRecord::Base

      @@redis = Redis.new

      set_table_name 'inputs'
      validates_presence_of :type, :created_by, :channel_id, :nick
      belongs_to :channel,          :class_name => 'Paleio::Channel',         :foreign_key => 'channel_id'
      belongs_to :creator,          :class_name => 'User',                    :foreign_key => 'created_by'
      after_create :create_journal_entry

      def is_code?
        !self.code_language.blank?
      end

      def as_json(options = {})
        {
            :id => self.id, :input => self.raw, :timestamp => self.created_at.to_i * 1000, :paste => self.paste, :is_code => self.is_code?,
            :code_language => self.code_language, :channel_id => self.channel_id, :nick => self.nick, :is_join => self.is_a?(Join)
        }
      end

      private
      def create_journal_entry
        self.channel.add_journal_entry(self)
        true
      end

      def broadcast
        @@redis.publish("channel_#{self.channel.code}", self.to_json)
        true
      end

    end

  end

end
