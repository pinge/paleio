module Paleio

  class Input < ActiveRecord::Base

    @@redis = Redis.new

    set_table_name 'inputs'
    validates_presence_of :created_by

    belongs_to :channel,          :class_name => 'Paleio::Channel',         :foreign_key => 'channel_id'

    after_create :create_journal_entry, :broadcast

    def as_json(options = {})
      {
          :id => self.id, :input => self.raw, :timestamp => self.created_at.to_i * 1000, :paste => self.paste, :is_code => self.is_code?,
          :code_language => self.code_language, :channel_id => self.channel_id, :nick => self.nick
      }
    end

    def is_code?
      !self.code_language.blank?
    end

    private
    def create_journal_entry
      self.channel.add_journal_entry(self)
      true
    end

    def broadcast
      Rails.logger.info "channel_#{self.channel.code}"
      @@redis.publish("channel_#{self.channel.code}", { :type => 'input', :input => {
          :input => self.raw, :timestamp => self.created_at.to_i * 1000, :nick => self.nick,
          :is_code => self.is_code?, :code_language => self.code_language
      } }.to_json)
      true
    end

  end

end
