let endpointURL = "http://localhost:9000/graphql"

async function fetchAPI(user, query, variables) {
  let response = await fetch(endpointURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": user ? `Basic ${user.token}` : "",
    },
    body: JSON.stringify({query, variables})
  })
  let responseBody = await response.json()
  if (responseBody.errors) {
    let message = responseBody.errors.map(err => err.message).join("\n")
    alert(message) // throw new Error(message)
    return {}
  }
  return responseBody.data
}

export async function loadCompany(user, id) {
  let {company} = await fetchAPI(user, `query ($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title    
        }
      }
    }`,
    {id}
  )
  return company
}

export async function loadJob(user, id) {
  let {job} = await fetchAPI(user, `query ($id: ID!) {
    job(id: $id) {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }`, {id})
  return job
}

export async function loadJobs(user) {
  let {jobs} = await fetchAPI(user, `query {
    jobs {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }`)
  return jobs
}

export async function createJob(user, input) {
  let {createJob} = await fetchAPI(user, `mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
    }
  }`, {input})
  return createJob
}

export async function login(email, password) {
  let {login} = await fetchAPI({}, `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }`, {email, password})
  return login
}
