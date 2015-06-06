require 'redis'

class AppCache
  attr_accessor :redis

  def initialize
    @redis = Redis.new
  end

  def set_by_lead(lead_id, state)
    @redis.set lead_id, state.to_json
  end

  def get_by_lead(lead_id)
    res = @redis.get lead_id
    JSON.parse(res)
  end

  def set_templates(templates)
    @redis.set "templates", templates.to_json
  end

  def get_templates
    res = @redis.get "templates"
    JSON.parse(res) if res
  end

end
