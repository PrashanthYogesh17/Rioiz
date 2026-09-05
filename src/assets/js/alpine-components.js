import Alpine from 'alpinejs';

export function registerAlpineComponents() {
  // Global Cart / Modular Workspace Store
  Alpine.store('cart', {
    isOpen: false,
    checkoutState: 'idle', // 'idle' | 'processing' | 'success'
    items: [
      {
        id: 'erp',
        name: 'Rioiz ERP',
        badge: 'Core Engine',
        priceMonthly: 2499,
        priceAnnual: 1999,
        icon: 'layers'
      }
    ],

    toggle() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },

    close() {
      this.isOpen = false;
      document.body.style.overflow = '';
    },

    addItem(product) {
      if (!this.items.some(i => i.id === product.id)) {
        this.items.push(product);
        // Trigger pulse on cart icon
        window.dispatchEvent(new CustomEvent('cart-item-added', { detail: product }));
      }
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    },

    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id);
    },

    hasItem(id) {
      return this.items.some(i => i.id === id);
    },

    get count() {
      return this.items.length;
    },

    get subtotalMonthly() {
      return this.items.reduce((sum, item) => sum + item.priceMonthly, 0);
    },

    get subtotalAnnual() {
      return this.items.reduce((sum, item) => sum + item.priceAnnual, 0);
    },

    fakeCheckout() {
      this.checkoutState = 'processing';
      setTimeout(() => {
        this.checkoutState = 'success';
        setTimeout(() => {
          this.checkoutState = 'idle';
          this.close();
        }, 2200);
      }, 1000);
    }
  });

  // Global Navigation Store
  Alpine.store('nav', {
    mobileOpen: false,
    suitesOpen: false,
    solutionsOpen: false,
    
    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
      document.body.style.overflow = this.mobileOpen ? 'hidden' : '';
    },
    
    closeMobile() {
      this.mobileOpen = false;
      document.body.style.overflow = '';
    }
  });

  // Cookie Consent Store
  Alpine.store('cookies', {
    visible: false,
    init() {
      const consent = localStorage.getItem('rioiz_cookie_consent');
      if (!consent) {
        setTimeout(() => {
          this.visible = true;
        }, 1200);
      }
    },
    acceptAll() {
      localStorage.setItem('rioiz_cookie_consent', 'all');
      this.visible = false;
    },
    acceptEssential() {
      localStorage.setItem('rioiz_cookie_consent', 'essential');
      this.visible = false;
    }
  });

  // Reusable Component: Pricing Switcher with animated number transitions
  Alpine.data('pricingState', (defaultCycle = 'annual') => ({
    isAnnual: defaultCycle === 'annual',
    rates: {
      starter: { monthly: 1299, annual: 999 },
      growth: { monthly: 2999, annual: 2499 },
      enterprise: { monthly: 6999, annual: 5599 }
    },

    toggle() {
      this.isAnnual = !this.isAnnual;
    },

    getPrice(tier) {
      return this.isAnnual ? this.rates[tier].annual : this.rates[tier].monthly;
    },

    getBillingText() {
      return this.isAnnual ? 'billed annually' : 'billed monthly';
    }
  }));

  // Reusable Component: Accordion
  Alpine.data('accordion', (defaultOpen = null) => ({
    active: defaultOpen,
    toggle(id) {
      this.active = this.active === id ? null : id;
    },
    isOpen(id) {
      return this.active === id;
    }
  }));

  // Reusable Component: Searchable FAQ
  Alpine.data('faqFilter', () => ({
    activeCategory: 'all',
    searchQuery: '',
    setCategory(cat) {
      this.activeCategory = cat;
    },
    matches(category, title, content) {
      const matchesCat = this.activeCategory === 'all' || this.activeCategory === category;
      const q = this.searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch = title.toLowerCase().includes(q) || content.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    }
  }));

  // Reusable Component: Products Hub Filter
  Alpine.data('productsFilter', () => ({
    activeCategory: 'all',
    setCategory(cat) {
      this.activeCategory = cat;
    },
    isVisible(category) {
      return this.activeCategory === 'all' || this.activeCategory === category;
    }
  }));

  // Reusable Component: Fake Form with Submitting and Success states
  Alpine.data('fakeForm', () => ({
    state: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
    errorMessage: '',
    submit(e) {
      this.state = 'submitting';
      setTimeout(() => {
        this.state = 'success';
      }, 950);
    },
    reset() {
      this.state = 'idle';
    }
  }));

  // Reusable Component: Registration Multi-step Wizard
  Alpine.data('registrationWizard', () => ({
    step: 1,
    companyName: '',
    workEmail: '',
    teamSize: '10-50',
    selectedModules: ['erp', 'billing'],
    isProvisioning: false,
    provisionSuccess: false,

    toggleModule(id) {
      if (this.selectedModules.includes(id)) {
        if (this.selectedModules.length > 1) {
          this.selectedModules = this.selectedModules.filter(m => m !== id);
        }
      } else {
        this.selectedModules.push(id);
      }
    },

    hasModule(id) {
      return this.selectedModules.includes(id);
    },

    next() {
      if (this.step < 3) {
        this.step++;
      } else if (this.step === 3) {
        this.isProvisioning = true;
        setTimeout(() => {
          this.isProvisioning = false;
          this.provisionSuccess = true;
          this.step = 4;
        }, 1400);
      }
    },

    back() {
      if (this.step > 1) {
        this.step--;
      }
    }
  }));

  // Reusable Component: Knowledge Base Sidebar & Search
  Alpine.data('knowledgeBase', () => ({
    activeTopic: 'getting-started',
    searchQuery: '',
    feedbackGiven: null,
    setTopic(topic) {
      this.activeTopic = topic;
    },
    giveFeedback(rating) {
      this.feedbackGiven = rating;
    }
  }));

  // NEW Interactive Component: Live Synapse Event Simulator
  Alpine.data('synapseSimulator', () => ({
    isRunning: false,
    activeStep: 0,
    totalSimulations: 142,
    logs: [
      { time: '14:20:10.892', module: 'CRM', text: 'Deal #8019 Won (Acme India Ltd - ₹6,50,000)' },
      { time: '14:20:10.893', module: 'INV', text: 'Stock Allocation: 50 Unit SKU-TX90 Reserved' },
      { time: '14:20:10.894', module: 'BIL', text: 'GST IRN #9182390 Generated via NIC Gateway' },
      { time: '14:20:10.895', module: 'ERP', text: 'Double-entry Journal Posted to Ledger #1020' }
    ],

    runSimulation() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.activeStep = 0;
      this.totalSimulations++;

      const stepDetails = [
        { module: 'CRM', text: 'Deal Won: Enterprise Expansion (TechNova Corp - ₹12,00,000)' },
        { module: 'INV', text: 'Multi-Warehouse Allocation: Reserved at Bengaluru DC' },
        { module: 'BIL', text: 'e-Invoice IRN Issued & Razorpay Payment Link Sent' },
        { module: 'ERP', text: 'Journal Balanced: Debit AR ₹12,00,000 / Credit Revenue' },
        { module: 'HRMS', text: 'Account Executive Commission Accrued to Payroll Ledger' }
      ];

      let current = 0;
      const interval = setInterval(() => {
        if (current < stepDetails.length) {
          this.activeStep = current;
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
          this.logs.unshift({
            time: timeStr,
            module: stepDetails[current].module,
            text: stepDetails[current].text
          });
          if (this.logs.length > 8) this.logs.pop();
          current++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            this.isRunning = false;
          }, 600);
        }
      }, 550);
    }
  }));

  // NEW Interactive Component: ROI & Cost Savings Calculator
  Alpine.data('roiCalculator', () => ({
    teamSize: 45,
    costPerSeatFragmented: 1850, // Approx INR cost/user/month across disparate tools
    
    get fragmentedMonthly() {
      return this.teamSize * this.costPerSeatFragmented;
    },

    get fragmentedAnnual() {
      return this.fragmentedMonthly * 12;
    },

    get rioizAnnual() {
      if (this.teamSize <= 15) return 999 * 12;
      if (this.teamSize <= 75) return 2499 * 12;
      return 5599 * 12;
    },

    get annualSavings() {
      return Math.max(0, this.fragmentedAnnual - this.rioizAnnual);
    },

    get savingsPercent() {
      if (!this.fragmentedAnnual) return 0;
      return Math.round((this.annualSavings / this.fragmentedAnnual) * 100);
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    }
  }));

  // NEW Interactive Component: 5-Suite Cockpit Showcase
  Alpine.data('suiteShowcase', () => ({
    activeSuite: 'erp',
    suites: {
      erp: {
        id: 'erp',
        name: 'Rioiz ERP',
        badge: 'Flagship Ledger',
        tagline: 'Autonomous double-entry accounting with instant bank reconciliation & GST tax engines.',
        color: 'teal',
        metrics: [
          { label: 'Ledger Accuracy', val: '99.98%' },
          { label: 'Reconciliation', val: 'Realtime' },
          { label: 'Sync Latency', val: '< 1.2ms' }
        ],
        features: [
          'Automatic 3-Way Match (PO + GRN + Invoice)',
          'Multi-Entity Ledger Consolidation & FX',
          'Instant GSTR-1 & GSTR-3B Generation',
          'Cryptographically Verified Audit Trails'
        ],
        price: '₹1,999/mo'
      },
      crm: {
        id: 'crm',
        name: 'Rioiz CRM',
        badge: 'Revenue Velocity',
        tagline: 'High-velocity deal pipelines seamlessly wired to inventory stock and billing contracts.',
        color: 'emerald',
        metrics: [
          { label: 'Deal Velocity', val: '3.4x' },
          { label: 'Phantom Stock', val: '0%' },
          { label: 'Contact 360', val: 'Instant' }
        ],
        features: [
          'Live Inventory Stock Reservation on Won Deals',
          'Automated Pro-forma Quotation Generator',
          'Omnichannel Email, WhatsApp & Phone Feeds',
          'AI-Guided Lead Scoring & Predictive ARR'
        ],
        price: '₹1,499/mo'
      },
      hrms: {
        id: 'hrms',
        name: 'Rioiz HRMS',
        badge: 'Workforce Hub',
        tagline: 'Zero-touch payroll, biometric attendance, and statutory PF/ESI compliance.',
        color: 'amber',
        metrics: [
          { label: 'Payroll Processing', val: '1-Click' },
          { label: 'PF/ESI Compliance', val: '100%' },
          { label: 'Self-Service', val: 'Mobile App' }
        ],
        features: [
          'Direct Bank Payouts via API Integrations',
          'Biometric Machine & Geofenced Mobile Punching',
          'Tax Slabs Auto-Adjustment (New vs Old Regime)',
          'Automated Expense Claims & Approval Hierarchies'
        ],
        price: '₹1,299/mo'
      },
      inventory: {
        id: 'inventory',
        name: 'Rioiz Inventory',
        badge: 'Supply Chain',
        tagline: 'Multi-warehouse stock tracking, serial/batch barcodes, and dynamic replenishment.',
        color: 'purple',
        metrics: [
          { label: 'Stock Accuracy', val: '99.95%' },
          { label: 'Barcoding Speed', val: '< 0.5s' },
          { label: 'Locations', val: 'Multi-DC' }
        ],
        features: [
          'Cross-Warehouse Batch & Serial Allocation',
          'Low-Stock Automated PO Reorder Triggers',
          'Barcode Label Generation & Mobile Scanning',
          'Landed Cost Calculation with Customs & Freight'
        ],
        price: '₹1,699/mo'
      },
      billing: {
        id: 'billing',
        name: 'Rioiz Billing',
        badge: 'Tax & Invoicing',
        tagline: 'Government GST IRN e-invoicing, recurring subscriptions, and multi-gateway links.',
        color: 'cyan',
        metrics: [
          { label: 'IRN Generation', val: 'Sub-second' },
          { label: 'Gateway Fallback', val: '3 Providers' },
          { label: 'Dunning Recovery', val: '72%' }
        ],
        features: [
          'Direct NIC Portal API Integration for IRN & QR',
          'Usage-based, Flat & Hybrid Subscription Billing',
          'Automated Payment Reminders via WhatsApp & SMS',
          'Unified Payment Recon with Razorpay & Stripe'
        ],
        price: '₹1,399/mo'
      }
    },
    setSuite(id) {
      this.activeSuite = id;
    }
  }));
}
