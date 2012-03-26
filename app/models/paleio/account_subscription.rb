module Paleio

  class AccountSubscription < ActiveRecord::Base

    set_table_name 'account_subscriptions'

    belongs_to :user,            :class_name => 'User',                    :foreign_key => 'user_id'
    belongs_to :account,         :class_name => 'Paleio::Account',         :foreign_key => 'account_id'
    validates_presence_of :user_id, :account_id
    validates_inclusion_of :owner, :admin, :in => [true,false]
    validates_uniqueness_of :user_id, :scope => [:account_id]
    before_validation :set_flags

    private
    def set_flags
      self.owner = false unless self.owner
      self.admin = false unless self.admin
      true
    end

  end

end
