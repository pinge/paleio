module Paleio

  module Channels

    class InputsController < ApplicationController

      #before_filter :authenticate_user!
      before_filter :find_channel, :only => [:index, :create]

      def index
        respond_to do |format|
          format.json{
            channel_inputs = @channel.inputs.where('created_at > ?', Time.zone.now.at_beginning_of_day).order('created_at ASC').all
            render :json => channel_inputs.to_json, :status => :ok
          }
        end
      end

      def create
        respond_to do |format|
          format.json{
            input_type = params[:input].delete(:type)
            common_params = { :channel_id => @channel.id, :created_by => current_user.id, :nick => current_user.name }
            last_activity = @channel.last_activity_by(current_user)
            case input_type
              when 'join' then
                Paleio::Input::Join.create!(params[:input].merge!(common_params)) if last_activity.nil? or last_activity < Time.zone.now.advance(:minutes => -30)
              when 'text' then
                Paleio::Input::Text.create!(params[:input].merge!(common_params))
              when 'code' then
                Paleio::Input::Code.create!(params[:input].merge!(common_params))
              when 'file' then
                Paleio::Input::File.create!(params[:input].merge!(common_params))
            end
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