require 'tiny_tds'

class Diamond
  attr_accessor :client, :errors

  def initialize(campus = "Austin")
    @db_name = campus_db_map[campus]
    @errors = []
    @client = new_client
  end

  def campus_db_map
    {
      "Austin" => "825-Austin", 
      "Brownsville" => "925-Brownsville"
    }
  end

  def new_client
    begin
      TinyTds::Client.new(
        username: 'sci\\' + ENV['DIAMOND_USERNAME'],
        password: ENV['DIAMOND_PASSWORD'],
        host: ENV['DIAMOND_HOST'],
        #host: '10.10.17.7',
        login_timeout: 10
      )
    rescue Exception => e
      puts e.red
      @errors.push({
        message: "Unable to Connect to Diamond Database Server", 
        type: "Timeout Error"
      })
    end
  end

  def get_lead_detail(leads_360_id)
    results = []
    @client.execute(
      "SELECT * 
      FROM [#{@db_name}].dbo.lead 
      WHERE Leads360ID = '#{leads_360_id}'"
    )
    .each { |r| 
      results << r 
    }
    results.first
  end

  def update_lead(id, lead)
    l = lead.map { |k, v| "#{k} = '#{v}'"  }.join(', ')
    @client.execute(
      "UPDATE [#{@db_name}].dbo.lead 
      SET #{l} 
      WHERE LeadsID = '#{id}'").do
  end

  def get_lead_documents(lead_id)
    results = []
    @client.execute(
      "SELECT DocumentID, Title 
      FROM [#{@db_name}].dbo.leadDocuments 
      WHERE LeadID = #{lead_id}"
    )
    .each { |r| 
      results << r
    }
    results
  end

  def add_document_to_lead(lead_id, document_id, title)
    @client.execute(
      "INSERT INTO [#{@db_name}].dbo.leadDocuments 
      (LeadID, DocumentID, Title) 
      VALUES ('#{lead_id}', '#{document_id}', '#{title}')"
    )
    .do
  end

  def destroy_document(document_id)
    @client.execute(
      "DELETE FROM [#{@db_name}].dbo.leadDocuments
      WHERE DocumentID='#{document_id}"
    ).do
  end

  def get_program_terms(program_description)
    results = []
    @client.execute(
      "SELECT DISTINCT Program.ProgramNo, Term.TermID, Term.TermBeginDate, Term.TermEndDate 
                    FROM [#{@db_name}].dbo.Program 
                    INNER JOIN [#{@db_name}].dbo.ProgramCourse
                    ON [#{@db_name}].dbo.Program.ProgramNo = [#{@db_name}].dbo.ProgramCourse.ProgramNo 
                    INNER JOIN [#{@db_name}].dbo.CourseOffering 
                    ON [#{@db_name}].dbo.ProgramCourse.CourseNo = [#{@db_name}].dbo.CourseOffering.CourseNo 
                    INNER JOIN [#{@db_name}].dbo.Term 
                    ON [#{@db_name}].dbo.CourseOffering.TermID = Term.TermID 
                    WHERE TermEndDate >= '#{Date.today.to_s}' 
                    AND ProgramDescription = '#{program_description}'"
    )
    .each { |r| 
      results << r 
    }
    results
  end
end
