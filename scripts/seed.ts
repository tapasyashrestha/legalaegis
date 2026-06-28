import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "aegis-e8873",
  appId: "1:807086731982:web:682e940e9b2f6d4cff169f",
  apiKey: "AIzaSyChlMswfFV9NTMU9ovLCgBfCBSSMph4EEo",
  authDomain: "aegis-e8873.firebaseapp.com",
  storageBucket: "aegis-e8873.firebasestorage.app",
  messagingSenderId: "807086731982",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getOrCreateUser(email, password, displayName, role) {
  let user;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    user = cred.user;
    await updateProfile(user, { displayName });
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      user = cred.user;
    } else {
      throw e;
    }
  }
  await setDoc(doc(db, "users", user.uid), {
    name: displayName,
    email: email,
    role: role,
    createdAt: new Date().toISOString()
  });
  return user;
}

async function seed() {
  try {
    const customerUser = await getOrCreateUser("customer@example.com", "password123", "John Doe", "customer");
    console.log("Customer ready:", customerUser.uid);

    const lawyerUser = await getOrCreateUser("lawyer@example.com", "password123", "Adv. Sharma", "lawyer");
    console.log("Lawyer ready:", lawyerUser.uid);

    // Sign back in as the customer so we can create reports for the customer
    await signInWithEmailAndPassword(auth, "customer@example.com", "password123");

    const pastReports = [
      {
        id: "rep_past_1",
        userId: customerUser.uid,
        notice_id: "GST-2023-001",
        status: "Analyzed",
        summary: "Notice regarding mismatch in ITC claimed in GSTR-3B and auto-populated in GSTR-2A for FY 2021-22.",
        severity: "Medium",
        notice_type: "ITC Mismatch",
        applicable_sections: ["Section 16(2)(c)"],
        issues_found: ["ITC claimed exceeds GSTR-2A by Rs. 50,000"],
        consequences: ["Demand of tax with interest under section 50", "Penalty under section 122"],
        required_documents: ["GSTR-2A for FY 21-22", "Purchase invoices", "Supplier payment proofs"],
        deadlines: ["2023-10-15"],
        recommendations: ["Reconcile ITC", "Obtain declarations from suppliers"],
        confidence_score: 92,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "rep_past_2",
        userId: customerUser.uid,
        notice_id: "GST-2023-089",
        status: "Analyzed",
        summary: "Show cause notice for cancellation of registration due to non-filing of returns for 6 consecutive months.",
        severity: "High",
        notice_type: "Registration Cancellation",
        applicable_sections: ["Section 29(2)(c)"],
        issues_found: ["Non-filing of GSTR-3B from Jan 2023 to June 2023"],
        consequences: ["Cancellation of GST registration", "Freezing of bank accounts potentially"],
        required_documents: ["Pending GSTR-3B returns data", "Bank statements"],
        deadlines: ["2023-08-20"],
        recommendations: ["File all pending returns immediately along with late fee and interest", "File reply to SCN requesting dropping of cancellation proceedings"],
        confidence_score: 95,
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "rep_past_3",
        userId: customerUser.uid,
        notice_id: "GST-2024-012",
        status: "Analyzed",
        summary: "Intimation of tax ascertained as being payable under section 73(5)/74(5).",
        severity: "Medium",
        notice_type: "Tax Shortfall Intimation",
        applicable_sections: ["Section 73", "Section 74"],
        issues_found: ["Short payment of output tax by Rs. 20,000 in Jan 2024"],
        consequences: ["Issuance of SCN under Section 73/74 if not paid"],
        required_documents: ["Sales register for Jan 2024", "GSTR-1 and GSTR-3B for Jan 2024"],
        deadlines: ["2024-03-10"],
        recommendations: ["Pay the ascertained tax with interest to avoid SCN and penalty", "File DRC-03"],
        confidence_score: 88,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const rep of pastReports) {
      await setDoc(doc(db, "reports", rep.id), rep);
      console.log("Report created:", rep.id);
    }

    const activeReport = {
        id: "rep_active_1",
        userId: customerUser.uid,
        notice_id: "GST-2024-099",
        status: "Pending", 
        summary: "Notice for scrutiny of returns under Section 61. Discrepancies found in outward supplies.",
        severity: "High",
        notice_type: "Return Scrutiny (ASMT-10)",
        applicable_sections: ["Section 61", "Rule 99"],
        issues_found: ["Liability declared in GSTR-3B is less than outward supplies in GSTR-1"],
        consequences: ["Proceeding under section 73 or 74 if satisfactory explanation not furnished"],
        required_documents: ["Reconciliation statement", "GSTR-1, GSTR-3B, E-way bill data"],
        deadlines: ["2024-07-10"],
        recommendations: ["Prepare reconciliation of GSTR-1 and GSTR-3B", "Furnish explanation in form ASMT-11", "Pay tax shortfall if any via DRC-03"],
        confidence_score: 91,
        created_at: new Date().toISOString()
    };
    await setDoc(doc(db, "reports", activeReport.id), activeReport);
    console.log("Active report created:", activeReport.id);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
