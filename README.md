<h1>Loss Database Query Application</h1>

<p>This application is designed to query a database of legal cases related to generative AI and provide a natural language summary of the results. It consists of a backend service built with NestJS and a frontend user interface built with React and Tailwind CSS.</p>

<h2>Demo</h2>
<p><img src="https://github.com/user-attachments/assets/5a4dc04f-c3f7-4f09-a5e3-e79b75d591aa" alt="loss_database_demo"></p>

<h2>Notes from demo</h2>
<ul>
  <li>The application answers questions with the current time included in the prompt. Summarisations are concise.</li>
  <li>The application can search by company well.</li>
  <li>The application needs enhancements to search by category.</li>
  <li>Application needs to format output responses to be more clear (perhaps with markdown) and as a list of cases / with references.</li>
</ul>

<h2>Installation and Setup</h2>

<h3>Backend</h3>
<ol>
  <li><strong>Clone the repository:</strong>
    <pre><code>git clone https://github.com/garethhaagman/loss-database-query.git
cd loss-database-query/backend
</code></pre>
  </li>
  <li><strong>Install dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>
  <li><strong>Create a <code>.env</code> file:</strong>
    <p>Create a <code>.env</code> file in the <code>backend</code> directory with the following content:</p>
    <pre><code>OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=sqlite://path_to_your_database.db
</code></pre>
  </li>
  <li><strong>Run the backend service:</strong>
    <pre><code>npm run start:dev</code></pre>
  </li>
</ol>

<h3>Frontend</h3>
<ol>
  <li><strong>Navigate to the frontend directory:</strong>
    <pre><code>cd ../frontend</code></pre>
  </li>
  <li><strong>Install dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>
  <li><strong>Run the frontend service:</strong>
    <pre><code>npm start</code></pre>
    <p>The frontend should be running on <a href="http://localhost:3001">http://localhost:3001</a>.</p>
  </li>
</ol>

<h2>Usage</h2>
<ol>
  <li><strong>Open the application:</strong>
    <p>Open your browser and navigate to <a href="http://localhost:3001">http://localhost:3001</a>.</p>
  </li>
  <li><strong>Enter a query:</strong>
    <p>Enter a natural language query into the search bar and press Enter or click the "Search" button.</p>
  </li>
  <li><strong>View the results:</strong>
    <p>The application will display a natural language summary of the query results. If there are relevant legal cases, they will be summarized accordingly.</p>
  </li>
</ol>

<h2>Key Points</h2>
<ol>
  <li><strong>Answers Questions with Current Time Included</strong>
    <p>The backend service includes the current date and time in the prompt to OpenAI, ensuring that responses are contextualized with the current time.</p>
  </li>
  <li><strong>Search by Company</strong>
    <p>The application can effectively search for legal cases related to specific companies, providing detailed summaries of incidents involving those companies.</p>
  </li>
  <li><strong>Enhancements Needed for Category Search</strong>
    <p>While the application can handle company-specific queries well, it needs enhancements to better support searching by category. Future updates will aim to improve this functionality.</p>
  </li>
</ol>

<h2>Contact</h2>
<p>For any questions or support, please contact <a href="mailto:gareth.haagman@testudo.co">gareth.haagman@testudo.co</a></p>

<hr>

<p>Thank you for using the Loss Database Query Application!</p>
