module ModelHelpers 

  def hashify
    JSON.parse(self.to_json).inject({}){ |memo, (k,v)| 
      memo[k.to_sym] = v; memo
    }
  end

end
