class AddEntities < ActiveRecord::Migration

  def up

    create_table :channels, :force => true do |t|
      t.string      :code
      t.string      :name
      t.integer     :account_id
      t.integer     :created_by
      t.string      :current_host
      t.integer     :current_port
      t.timestamps
    end

    create_table :inputs, :force => true do |t|
      t.text      :raw
      t.string    :nick
      t.integer   :channel_id
      t.boolean   :paste
      t.string    :code_language
      t.integer   :created_by
      t.timestamps
    end

    create_table :journals, :force => true do |t|
      t.integer   :account_id
      t.integer   :channel_id
      t.integer   :year
      t.integer   :month
      t.integer   :day
      t.timestamps
    end

    create_table :entries, :force => true do |t|
      t.string    :type
      t.integer   :journal_id
      t.string    :nickname
      t.text      :text
      t.boolean   :paste
      t.string    :code_language
      t.integer   :created_by
      t.timestamps
    end

    create_table :accounts, :force => true do |t|
      t.string    :subdomain
      t.integer   :created_by
      t.timestamps
    end

    create_table :account_subscriptions, :force => true do |t|
      t.integer   :user_id
      t.integer   :account_id
      t.boolean   :owner
      t.boolean   :admin
    end

  end

  def down
  end

end
