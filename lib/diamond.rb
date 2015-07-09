require 'tiny_tds'
require './lib/app_cache'

class Diamond
  attr_accessor :client, :errors

  def initialize(campus = "Austin")
    @db_name = campus_db_map[campus]
    @errors = []
    @client = new_client
  end

  def new_client
    begin
      TinyTds::Client.new(
        username: 'sci\\' + ENV['DIAMOND_USERNAME'],
        password: ENV['DIAMOND_PASSWORD'],
        host: ENV['DIAMOND_HOST'], #host: '10.10.17.7',
        login_timeout: 10
      )
    rescue Exception => e
      @errors.push(timeout_error)
    end
  end

  def timeout_error
    { message: "Unable to Connect to Diamond Database Server", 
      type: "Timeout Error" }
  end

  def query(q)
    results = []
    @client
      .execute(q)
      .each { |r| results << r }
    results
  end

  def campus_db_map
    {
      "Austin" => "825-Austin", 
      "Brownsville" => "831-Brown",
      "San Antonio North" => "824-SAN",
      "San Antonio - North" => "824-SAN",
      "San Antonio South" => "826-SA",
      "San Antonio - South" => "826-SA",
      "Harlingen" => "827-HAR",
      "Pharr" => "829-PHAR",
      "Corpus Christi" => "830-CC1",
      "Online" => "801-Online"
    }
  end

  def tables
    {
      term: get_table("Term"),
      program: get_table("Program"),
      lead: get_table("lead"),
      program_fee: get_table("ProgramFee")
    }
  end

  def get_table(name)
    "[#{@db_name}].dbo.#{name}"
  end

  def get_lead_detail(vid)
    res = query "SELECT * 
                 FROM #{tables[:lead]}
                 WHERE Leads360ID = '#{vid}'"
    res.first
  end

  def update_lead(id, lead)
    l = lead.map { |k, v| "#{k} = '#{v}'"  }.join(', ')
    @client.execute(
      "UPDATE [#{@db_name}].dbo.lead 
      SET #{l} 
      WHERE LeadsID = '#{id}'").do
  end

  def get_programs
    query "SELECT Program.ProgramNo, Program.ProgramDescription, Program.Units, 
           Program.MonthsRequired, Program.HoursRequired, Program.WeeksRequired, 
           Program.Session, ProgramFee.ProgramFeeAmount
           FROM #{tables[:program]}
           INNER JOIN #{tables[:program_fee]}
           ON #{tables[:program]}.ProgramNo = #{tables[:program_fee]}.ProgramNo
           WHERE ActiveStatus='Y'
           AND LedgerNo = 1"
  end

  def get_programs_with_tuition
    programs = get_programs
    programs.map {|p|
      p["Tuition"] = p["ProgramFeeAmount"].to_i
      p["OtherFees"] = 0
      p["RegFees"] = 0
      p["ReportYear"] = "2013-2014"
      p
    }
  end

  def get_program_terms(program_no, refresh=false)
    #query "SELECT DISTINCT ProgramCourse.ProgramNo, Term.TermID, Term.TermBeginDate, Term.TermEndDate 
           #FROM [#{@db_name}].dbo.ProgramCourse
           #INNER JOIN [#{@db_name}].dbo.CourseOffering 
           #ON [#{@db_name}].dbo.ProgramCourse.CourseNo = [#{@db_name}].dbo.CourseOffering.CourseNo 
           #INNER JOIN [#{@db_name}].dbo.Term 
           #ON [#{@db_name}].dbo.CourseOffering.TermID = Term.TermID 
           #WHERE TermEndDate >= '#{Date.today.to_s}' 
           #AND ProgramNo = '#{program_no}'"
      #end_date = Date.new(2016,1,1).to_s
      end_date = Date.today.to_s
      query "SELECT DISTINCT Term.TermID, Term.TermBeginDate, Term.TermEndDate 
           FROM #{tables[:term]}
           WHERE TermBeginDate >= '#{end_date}'"
  end
end
