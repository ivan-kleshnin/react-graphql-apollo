let endpointURL = "http://localhost:9000/graphql"

async function fetchAPI(user, query, variables) {
  let response = await fetch(endpointURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": user ? `bearer ${user.token}` : "",
    },
    body: JSON.stringify({query, variables})
  })
  let responseBody = await response.json()
  if (responseBody.errors) {
    let message = responseBody.errors.map(err => err.message).join("\n")
    throw Error(message)
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
  let response = await fetch("http://localhost:9000/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, password}),
  })
  if (response.status != 200) { // TODO other codes?
    let error = await response.json()
    throw Error(error.message)
  }
  let user = await response.json()
  return user
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiQkpycC1EdWRHIn0sImlhdCI6MTU1MzY5MjA4MCwiZXhwIjoxNTUzNjkzODgwfQ.n66zaZcYLcNV0TRAFe-tzFxBhtscFK5MRLBcPc6xaZc
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiQkpycC1EdWRHIn0sImlhdCI6MTU1MzY4ODkxNCwiZXhwIjoxNTUzNjkwNzE0fQ.62_5imneDNek39ajUUUX00ACW_Kp66qzVkq0Uxe25bs
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiQkpycC1EdWRHIn0sImlhdCI6MTU1MzY5MTUyNSwiZXhwIjoxNTUzNjkzMzI1fQ.zseriJriYuCG2qOA3GLN3HEUuKByoyr7aOv30wHHdqU
