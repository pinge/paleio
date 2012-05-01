module Paleio

  class Account < ActiveRecord::Base

    set_table_name 'accounts'

    belongs_to :owner,            :class_name => 'User',                    :foreign_key => 'created_by'
    has_many :channels,           :class_name => 'Paleio::Channel',         :foreign_key => 'account_id'
    has_many :account_subscriptions, :class_name => 'Paleio::AccountSubscription', :foreign_key => 'account_id'
    has_many :users, :through => :account_subscriptions, :uniq => true
    validates_presence_of :subdomain
    validates_uniqueness_of :subdomain
    before_validation :set_subdomain
    after_create :create_owner_subscription

    def invite_user!(params)
      User.transaction do
        invited_user = User.invite!(params){ |u| u.skip_invitation = true }
        self.account_subscriptions.create!({ :user_id => invited_user.id})
        Devise.mailer.invitation_instructions(invited_user).deliver
        invited_user
      end
    end

    private
    def set_subdomain
      self.subdomain = self.owner.email.gsub(/[^a-zA-Z]/, '')
      true
    end

    def create_owner_subscription
      self.account_subscriptions.create!({ :user_id => self.created_by, :owner => true, :admin => true })
      true
    end

  end

end
