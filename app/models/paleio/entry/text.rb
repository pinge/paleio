module Paleio

  module Entry

    class Text < Paleio::Entry::Base

      validates_presence_of :text
      validates_inclusion_of :paste, :in => [true,false]
      private

    end

  end

end
