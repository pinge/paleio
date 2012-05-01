module Paleio

  class Journal < ActiveRecord::Base

    set_table_name 'journals'

    belongs_to :channel,          :class_name => 'Paleio::Channel',         :foreign_key => 'channel_id'
    has_many :entries,            :class_name => 'Paleio::Entry::Base',     :foreign_key => 'journal_id'
    validates_presence_of :account_id, :channel_id, :year, :day, :month
    validates_uniqueness_of :day, :scope => [:month, :year, :channel_id, :account_id]

    def self.record_entry!(entry_attributes)
      Rails.logger.ap entry_attributes
    end

    def add_entry(raw_entry)
      if raw_entry.is_a?(Paleio::Input::Join)
        Paleio::Entry::Join.create!({
                                        :journal_id => self.id, :nickname => raw_entry.nick, :created_by => raw_entry.created_by
                                    })
      elsif raw_entry.is_a?(Paleio::Input::Text)
        Paleio::Entry::Text.create!({
                                        :journal_id => self.id, :nickname => raw_entry.nick, :created_by => raw_entry.created_by,
                                        :text => raw_entry.raw, :paste => raw_entry.paste
                                    })
      elsif raw_entry.is_a?(Paleio::Input::Code)
        Paleio::Entry::Code.create!({
                                        :journal_id => self.id, :nickname => raw_entry.nick, :created_by => raw_entry.created_by,
                                        :text => raw_entry.raw, :paste => raw_entry.paste, :code_language => raw_entry.code_language
                                    })
      elsif raw_entry.is_a?(Paleio::Input::File)
        Paleio::Entry::File.create!({
                                        :journal_id => self.id, :nickname => raw_entry.nick, :created_by => raw_entry.created_by,
                                        :document => raw_entry.document.filename, :paste => raw_entry.paste, :document_content_type => raw_entry.content_type
                                    })
      end
    end

    #def as_json(options = {})
    #  {
    #      :id => self.id, :input => self.raw, :timestamp => self.created_at.to_i * 1000, :paste => self.paste, :is_code => self.is_code?,
    #      :code_language => self.code_language, :channel_id => self.channel_id, :nick => self.nick
    #  }
    #end

    private

  end

end
