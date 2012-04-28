module Paleio

  module Entry

    class File < Paleio::Entry::Base

      #mount_uploader :document, DocumentUploader
      validates_presence_of :document, :document_content_type
      #validates_integrity_of :document
      #validates_processing_of :document
      validates_inclusion_of :paste, :in => [true,false]

    end

  end

end
