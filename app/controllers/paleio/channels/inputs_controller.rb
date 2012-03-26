module Paleio

  module Channels

    class InputsController < ApplicationController

      #before_filter :authenticate_user!
      before_filter :find_channel, :only => [:index, :create]

      def index
        respond_to do |format|
          format.json{
            channel_inputs = @channel.inputs.where('created_at > ?', Time.zone.now.at_beginning_of_day).all
            render :json => channel_inputs.to_json, :status => :ok
          }
        end
      end

      def create
        respond_to do |format|
          format.json{
            @channel.inputs.create!(params[:input].merge!({ :created_by => current_user.id }))
            render :json => {}.to_json, :status => :created
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