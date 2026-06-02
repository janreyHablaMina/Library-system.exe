const fs = require('fs');

function updateBorrowReturnPage() {
  let content = fs.readFileSync('src/pages/BorrowReturnPage.tsx', 'utf8');

  // Add prop type
  content = content.replace(
    /type BorrowReturnPageProps = \{[\s\S]*?initialTab\?: 'borrow' \| 'return'\n\}/,
    `type BorrowReturnPageProps = {
  isDarkMode: boolean
  onOpenTransactions: (tab: 'all' | 'borrowed' | 'returned' | 'overdue') => void
  initialTab?: 'borrow' | 'return'
  prefillBorrowData?: { memberId: number, bookId: number } | null
}`
  );

  // Update component definition
  content = content.replace(
    /export function BorrowReturnPage\(\{ isDarkMode, onOpenTransactions, initialTab = 'borrow' \}: BorrowReturnPageProps\) \{/,
    `export function BorrowReturnPage({ isDarkMode, onOpenTransactions, initialTab = 'borrow', prefillBorrowData }: BorrowReturnPageProps) {`
  );

  // Inject useEffect to handle prefill
  const prefillEffect = `
  useEffect(() => {
    if (prefillBorrowData && members.length > 0 && books.length > 0) {
      const mem = members.find(m => m.id === prefillBorrowData.memberId)
      if (mem) setSelectedMember(mem)
      
      const bk = books.find(b => b.id === prefillBorrowData.bookId)
      if (bk) setSelectedBook(bk)
    }
  }, [prefillBorrowData, members, books])
`;

  content = content.replace(
    /useEffect\(\(\) => \{\n    void loadData\(\)\n  \}, \[\]\)/,
    `useEffect(() => {\n    void loadData()\n  }, [])\n${prefillEffect}`
  );

  fs.writeFileSync('src/pages/BorrowReturnPage.tsx', content);
  console.log('BorrowReturnPage updated');
}

function updateAppTsx() {
  let content = fs.readFileSync('src/App.tsx', 'utf8');

  // Inject state
  content = content.replace(
    /const \[transactionActiveTab, setTransactionActiveTab\] = useState<'all' \| 'borrowed' \| 'returned' \| 'overdue'>\('all'\)/,
    `const [transactionActiveTab, setTransactionActiveTab] = useState<'all' | 'borrowed' | 'returned' | 'overdue'>('all')\n  const [borrowPrefill, setBorrowPrefill] = useState<{ memberId: number, bookId: number } | null>(null)`
  );

  // Update rendering of BorrowReturnPage
  content = content.replace(
    /<BorrowReturnPage\s+key=\{borrowReturnActiveTab\}\s+isDarkMode=\{isDarkMode\}\s+initialTab=\{borrowReturnActiveTab\}\s+onOpenTransactions=\{\(tab\) => \{[\s\S]*?\}\s+\/>/,
    `<BorrowReturnPage
                key={borrowReturnActiveTab}
                isDarkMode={isDarkMode}
                initialTab={borrowReturnActiveTab}
                prefillBorrowData={borrowPrefill}
                onOpenTransactions={(tab) => {
                  setTransactionActiveTab(tab)
                  setActivePage('All Transactions')
                }}
              />`
  );

  // Add handleNavigateToBorrow
  const navHandler = `
  const handleNavigateToBorrow = (memberId: number, bookId: number) => {
    setBorrowPrefill({ memberId, bookId })
    setActivePage('Transactions')
    setBorrowReturnActiveTab('borrow')
  }
`;

  content = content.replace(
    /const openTransactionsPage = \(tab: 'all' \| 'borrowed' \| 'returned' \| 'overdue' = 'all'\) => \{/,
    `${navHandler}\n  const openTransactionsPage = (tab: 'all' | 'borrowed' | 'returned' | 'overdue' = 'all') => {`
  );

  // Update rendering of ReservationsPage
  content = content.replace(
    /<ReservationsPage\s+isDarkMode=\{isDarkMode\}\s+onOpenTransactionDetail=\{\(id\) => \{\s+setSelectedTransactionId\(id\)\s+setIsTransactionDetailOpen\(true\)\s+\}\}\s+\/>/,
    `<ReservationsPage
                  isDarkMode={isDarkMode}
                  onOpenTransactionDetail={(id) => {
                    setSelectedTransactionId(id)
                    setIsTransactionDetailOpen(true)
                  }}
                  onNavigateToBorrow={handleNavigateToBorrow}
                />`
  );

  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx updated');
}

updateBorrowReturnPage();
updateAppTsx();
