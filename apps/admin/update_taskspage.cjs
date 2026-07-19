const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/TasksPage.jsx');
let content = fs.readFileSync(file, 'utf-8');

// Replace mockTasks mapping
content = content.replace(/mockTasks/g, "tasks");

// Inject real states and API logic
const stateInjection = `  const menuRef = useRef(null);

  // Real API states
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const res = await fetch('http://localhost:4000/api/crm/tasks', { headers });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch(e) {}
  };

  useEffect(() => { fetchData(); }, []);
`;
content = content.replace("  const menuRef = useRef(null);", stateInjection);

fs.writeFileSync(file, content);
console.log("TasksPage updated successfully");
