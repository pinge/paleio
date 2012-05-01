module Paleio

  class ChannelsController < ApplicationController

    #before_filter :authenticate_user!

    def index
      respond_to do |format|
        format.json{
          render :json => Paleio::Channel.all.to_json, :status => :ok
        }
      end
    end

  end

end