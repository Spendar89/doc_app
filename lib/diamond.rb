require 'tiny_tds'
class Diamond
  attr_accessor :client

  def initialize
    @client = TinyTds::Client.new username: 'sci\jsendar', password: 'Pass020215$', host: '10.10.17.7'
    #@client = {}
  end

  def test_execute
    results = []
    @client.execute("SELECT TOP 20 * FROM [825-Austin].dbo.lead").each {|r| results << r}
    results
  end

  def get_lead_detail(leads_360_id)
    results = []
    @client.execute("SELECT * FROM [825-Austin].dbo.lead where Leads360ID = '#{leads_360_id}'").each {|r| results << r}
    results.first
    #{"FName" => "Jake", "LName" => "Sendar", "Phone" => "2022554618", "Address" => "8708 Brickyard Rd", "Email" => "jakesendar@gmail.com"}
  end

  def update_lead(id, lead)
    l = lead.map { |k, v| "#{k} = '#{v}'"  }.join(', ')
    @client.execute("UPDATE [825-Austin].dbo.lead SET #{l} WHERE LeadsID = '#{id}'").do
  end

  #def get_program_courses(program_no)
    #results = []
    #@client.execute("SELECT * FROM [825-Austin].dbo.ProgramCourse where ProgramNo = '#{program_no}'").each {|r| results << r}
    #results
  #end

  #def get_course_terms(course_no)
    #results = []
    #@client.execute("SELECT Term.TermID, Term.TermBeginDate, Term.TermEndDate FROM [825-Austin].dbo.CourseOffering INNER JOIN [825-Austin].dbo.Term ON [825-Austin].dbo.CourseOffering.TermID = Term.TermID where CourseNo = '#{course_no}'").each {|r| results << r}
    #results
  #end
 
  def get_lead_documents(lead_id)
    results = []
    @client.execute("SELECT DocumentID, Title FROM [825-Austin].dbo.leadDocuments WHERE LeadID = #{lead_id}").each{|r| results << r}
    results
  end

  def add_document_to_lead(lead_id, document_id, title)
    @client.execute(
      "INSERT INTO [825-Austin].dbo.leadDocuments 
      (LeadID, DocumentID, Title) 
      VALUES ('#{lead_id}', '#{document_id}', '#{title}')"
    ).do
  end

  def get_program_terms(program_description)
    results = []
    @client.execute(
      "SELECT DISTINCT Program.ProgramNo, Term.TermID, Term.TermBeginDate, Term.TermEndDate 
                    FROM [825-Austin].dbo.Program 
                    INNER JOIN [825-Austin].dbo.ProgramCourse
                    ON [825-Austin].dbo.Program.ProgramNo = [825-Austin].dbo.ProgramCourse.ProgramNo 
                    INNER JOIN [825-Austin].dbo.CourseOffering 
                    ON [825-Austin].dbo.ProgramCourse.CourseNo = [825-Austin].dbo.CourseOffering.CourseNo 
                    INNER JOIN [825-Austin].dbo.Term 
                    ON [825-Austin].dbo.CourseOffering.TermID = Term.TermID 
                    WHERE TermEndDate >= '#{Date.today.to_s}' 
                    AND ProgramDescription = '#{program_description}'"
    ).each { |r| results << r }
    results
  end
end
