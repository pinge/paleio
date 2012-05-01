module Paleio
  module Channels
    module Entries

      class FilesController < ApplicationController

        #before_filter :authenticate_user!
        before_filter :find_channel, :only => [:index, :create]

        def index
          respond_to do |format|
            format.json{
              channel_file_inputs = @channel.file_inputs.where('created_at > ?', Time.zone.now.at_beginning_of_day).order('created_at ASC').all
              render :json => channel_file_inputs.to_json, :status => :ok
            }
          end
        end

        private
        def find_channel
          @channel = Paleio::Channel.find(params[:channel_id])
        end

      end

    end
  end
end
