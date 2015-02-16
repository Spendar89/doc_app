require 'sinatra'
require './lib/doc_maker'

get '/' do
  my_account = HelloSign.get_account
  return my_account.inspect
end
