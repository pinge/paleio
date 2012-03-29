# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120325145940) do

  create_table "account_subscriptions", :force => true do |t|
    t.integer "user_id"
    t.integer "account_id"
    t.boolean "owner"
    t.boolean "admin"
  end

  create_table "accounts", :force => true do |t|
    t.string   "subdomain"
    t.integer  "created_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "channels", :force => true do |t|
    t.string   "code"
    t.string   "name"
    t.integer  "account_id"
    t.integer  "created_by"
    t.string   "current_host"
    t.integer  "current_port"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "entries", :force => true do |t|
    t.string   "type"
    t.integer  "journal_id"
    t.string   "nickname"
    t.text     "text"
    t.boolean  "paste"
    t.string   "code_language"
    t.integer  "created_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "inputs", :force => true do |t|
    t.string   "type"
    t.integer  "channel_id"
    t.string   "nick"
    t.text     "raw"
    t.boolean  "paste"
    t.string   "code_language"
    t.integer  "created_by"
    t.string   "file"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "journals", :force => true do |t|
    t.integer  "account_id"
    t.integer  "channel_id"
    t.integer  "year"
    t.integer  "month"
    t.integer  "day"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "nickname"
    t.integer  "created_by"
    t.string   "invitation_message"
    t.string   "email",                                :default => "", :null => false
    t.string   "encrypted_password",                   :default => ""
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                        :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "invitation_token",       :limit => 60
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.integer  "invited_by_id"
    t.string   "invited_by_type"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token"
  add_index "users", ["invited_by_id"], :name => "index_users_on_invited_by_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
