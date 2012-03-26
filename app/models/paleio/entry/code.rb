module Paleio

  module Entry

    class Code < Paleio::Entry::Base

      validates_presence_of :code_language

      private

    end

  end

end
