module Paleio

  module Input

    class File < Paleio::Input::Base

      mount_uploader :document, DocumentUploader
      validates_presence_of :document
      validates_integrity_of :document
      validates_processing_of :document
      validates_inclusion_of :paste, :in => [false] # TODO :in => [true,false]
      before_validation :set_paste, :set_content_type

      def is_image?
        # TODO add more mimetypes
        [
            'image/jpeg'
        ].include?(self.content_type)
      end

      def is_compressed?
        [
            'application/zip',
            'application/x-rar-compressed'
        ].include?(self.content_type)
      end

      def as_json(options = {})
        {
            :type => 'file', :id => self.id, :channel_id => self.channel_id, :timestamp => self.created_at.to_i * 1000,
            :nick => self.nick, :paste => self.paste, :filename => self.document.filename, :url => self.document.url,
            :content_type => self.content_type, :is_image => self.is_image?, :is_compressed => self.is_compressed?,
            :filesize => self.document.size
        }
      end

      private
      def set_paste
        self.paste = false
        true
      end

      def set_content_type
        self.content_type = self.document.file.content_type
        true
      end

    end

  end

end
