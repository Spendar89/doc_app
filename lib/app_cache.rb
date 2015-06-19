require 'redis'

class AppCache
  attr_accessor :redis

  def initialize
    @redis = Redis.new(url: ENV['REDIS_URL'])
  end

  def get(key)
    begin
      res = @redis.get key
      JSON.parse(res)
    rescue
      []
    end
  end

  def set(key, val)
    return unless key && val
    @redis.set key, val.to_json
  end

  def set_by_lead(lead_id, state)
    @redis.set lead_id, state.to_json
  end

  def get_by_lead(lead_id)
    res = @redis.get lead_id
    JSON.parse(res)
  end

  def set_templates(templates)
    set "templates", templates 
  end

  def get_templates
    get "templates"
  end

  def set_terms(terms)
    set "terms", terms
  end

  def get_terms
    get "terms"
  end

end
