module Paleio

  module Entry

    class Code < Paleio::Entry::Base

      validates_presence_of :code_language, :text
      validates_inclusion_of :paste, :in => [true,false]

      private

    end

  end

end
