---
trigger: always_on
---

# Clean Code Principles - Part 2

> TypeScript, React Patterns, Anti-patterns

---

## TYPESCRIPT

### Toujours typer

```typescript
// ❌ MAUVAIS
function calculateTotal(items) {
  return items.reduce((acc, item) => acc + item.price, 0);
}

// ✅ BON
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}
```

### Jamais de `any`

```typescript
// ❌ MAUVAIS
const handleResponse = (data: any) => {
  console.log(data.user.name);
};

// ✅ BON
interface ApiResponse {
  user: {
    name: string;
    email: string;
  };
}

const handleResponse = (data: ApiResponse) => {
  console.log(data.user.name);
};

// ✅ Si vraiment inconnu, utiliser unknown
const handleUnknown = (data: unknown) => {
  if (isApiResponse(data)) {
    console.log(data.user.name);
  }
};
```

### Types et Interfaces

```typescript
// Interface pour les props
interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
}

// Type pour les données
type User = {
  id: string;
  name: string;
  email: string;
};

// Type utilitaire
type UserWithPosts = User & { posts: Post[] };
```

---

## REACT PATTERNS

### Composition over props

```typescript
// ❌ MAUVAIS - trop de props
<Card
  title="Title"
  subtitle="Subtitle"
  image="/img.jpg"
  cta="Click"
  ctaOnClick={handleClick}
/>

// ✅ BON - composition
<Card>
  <Card.Image src="/img.jpg" />
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Subtitle>Subtitle</Card.Subtitle>
  </Card.Header>
  <Card.Footer>
    <Button onClick={handleClick}>Click</Button>
  </Card.Footer>
</Card>
```

### Custom hooks pour la logique

```typescript
// ❌ MAUVAIS - logique dans le composant
function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .finally(() => setIsLoading(false));
  }, [query]);

  // render...
}

// ✅ BON - logique dans un hook
function useSearch(query: string) {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setIsLoading(true);

    searchService
      .search(query, { signal: controller.signal })
      .then(setResults)
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [query]);

  return { results, isLoading };
}

function SearchResults() {
  const [query, setQuery] = useState("");
  const { results, isLoading } = useSearch(query);
  // render seulement
}
```

### Mémoization

```typescript
// Quand utiliser useMemo
const expensiveValue = useMemo(() => {
  return items.filter((x) => x.active).map((x) => transform(x));
}, [items]);

// Quand utiliser useCallback
const handleClick = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ❌ NE PAS over-mémoizer
const simpleValue = useMemo(() => a + b, [a, b]); // Inutile
```

---

## ANTI-PATTERNS À ÉVITER

### 1. Props drilling

```typescript
// ❌ MAUVAIS
<App user={user}>
  <Layout user={user}>
    <Header user={user}>
      <Avatar user={user} />
    </Header>
  </Layout>
</App>;

// ✅ BON - Zustand
const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

function Avatar() {
  const user = useUserStore((s) => s.user);
  return <img src={user?.avatar} />;
}
```

### 2. useEffect pour computed values

```typescript
// ❌ MAUVAIS
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ BON - derived state
const fullName = `${firstName} ${lastName}`;
```

### 3. State pour données dérivées

```typescript
// ❌ MAUVAIS
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);
const [count, setCount] = useState(0);

useEffect(() => {
  setFilteredItems(items.filter((x) => x.active));
}, [items]);

useEffect(() => {
  setCount(filteredItems.length);
}, [filteredItems]);

// ✅ BON
const [items, setItems] = useState([]);
const filteredItems = items.filter((x) => x.active);
const count = filteredItems.length;
```

### 4. Magic numbers

```typescript
// ❌ MAUVAIS
gsap.to(element, { duration: 0.8, y: 60 })
if (width < 768) { ... }

// ✅ BON
const ANIMATION = {
  DURATION: 0.8,
  REVEAL_OFFSET: 60,
}

gsap.to(element, { duration: ANIMATION.DURATION, y: ANIMATION.REVEAL_OFFSET })
if (width < BREAKPOINTS.MD) { ... }
```

### 5. Console.log en production

```typescript
// ❌ MAUVAIS
console.log("user", user);

// ✅ BON
if (process.env.NODE_ENV === "development") {
  console.log("debug", data);
}
```

---

## CHECKLIST AVANT COMMIT

- [ ] Pas de `any` TypeScript
- [ ] Pas de `console.log`
- [ ] Pas de code commenté
- [ ] Pas de TODO non traités
- [ ] Composants < 150 lignes
- [ ] Fonctions < 30 lignes
- [ ] Nommage clair
- [ ] Cleanup dans useEffect
- [ ] Error handling sur async
- [ ] Types exportés si réutilisés
