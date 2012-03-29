module Paleio

  module Entry

    class File < Paleio::Entry::Base

      mount_uploader :file, ChannelUploader
      validates_presence_of :file
      validates_inclusion_of :paste, :in => [true,false]
      private

    end

  end

end
