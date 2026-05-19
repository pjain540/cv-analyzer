import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilList } from "@coreui/icons";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalResumes: 0,
    totalJobDescriptions: 0,
    totalResults: 0
  });

  const [latestResults, setLatestResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Counts
        const countsRes = await dashboardService.getDashboardCounts();
        if (countsRes.success) {
          setCounts(countsRes.data);
        }

        // Fetch Latest Analysis
        const analysisData = await dashboardService.getLatestFiveAnalysis();
        setLatestResults(analysisData.data || []);
      } catch (error) {
        console.log("Error in fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <WidgetsDropdown className="mb-4" data={counts} />
      <CCard className="mb-4 shadow-sm border-0">
        <CCardHeader className="border-0 py-3">
          <div className="d-flex align-items-center">
            <CIcon icon={cilList} className="me-2" size="lg" />
            <h5 className="mb-0 fw-bold">Recent Analysis Results</h5>
          </div>
        </CCardHeader>
        <CCardBody>
          {latestResults && latestResults.length > 0 ? (
            <CAccordion flush activeItemKey={0}>
              {latestResults.map((result: any, index: number) => (
                <CAccordionItem itemKey={index} key={result._id}>
                  <CAccordionHeader>
                    <div className="d-flex justify-content-between w-100 pe-3">
                      <span className="fw-semibold">
                        {result.jobDescription?.title || "Unknown Position"}
                      </span>
                      <CBadge color="info" shape="rounded-pill" className="ms-2 d-flex align-items-center">
                        Exp: {result.jobDescription?.experience || "N/A"}
                      </CBadge>
                    </div>
                  </CAccordionHeader>
                  <CAccordionBody className="border">
                    <CTable hover responsive align="middle" className="mb-0 border rounded">
                      <CTableHead color="">
                        <CTableRow>
                          <CTableHeaderCell>Candidate Name</CTableHeaderCell>
                          <CTableHeaderCell>AI Summary</CTableHeaderCell>
                          <CTableHeaderCell>Match %</CTableHeaderCell>

                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {result.resumes.map((res: any) => (
                          <CTableRow key={res._id}>
                            <CTableDataCell>
                              <div className="d-flex align-items-center">
                                {/* <CIcon icon={cilUser} className="me-2 opacity-50" /> */}
                                {res.resumeId?.name || "Anonymous Candidate"}
                              </div>
                            </CTableDataCell>



                            {/* Updated AI Summary with 50-character splitter/truncation */}
                            <CTableDataCell className="small text-muted" style={{ maxWidth: '300px', paddingRight: '50px' }}>
                              {/* {res.aiRemark?.length > 50
                                ? res.aiRemark.substring(0, 50) + '...'
                                : res.aiRemark} */}
                              {res.aiRemark}
                            </CTableDataCell>
                            {/* Updated Match % with Progress Bar */}
                            <CTableDataCell style={{ minWidth: '180px' }}>
                              <div className="d-flex align-items-center gap-2">
                                <div className="flex-grow-1" style={{ width: '100px' }}>
                                  <div className="progress" style={{ height: '8px' }}>
                                    <div
                                      className={`progress-bar bg-${res.matchPercentage >= 70 ? 'success' : res.matchPercentage >= 40 ? 'warning' : 'danger'}`}
                                      role="progressbar"
                                      style={{ width: `${res.matchPercentage}%` }}
                                      aria-valuenow={res.matchPercentage}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    ></div>
                                  </div>
                                </div>
                                <CBadge color={res.matchPercentage >= 70 ? 'success' : res.matchPercentage >= 40 ? 'warning' : 'danger'}>
                                  {res.matchPercentage}%
                                </CBadge>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>

                    </CTable>
                  </CAccordionBody>
                </CAccordionItem>
              ))}
            </CAccordion>
          ) : (
            <div className="text-center py-5 text-muted">
              <CIcon icon={cilList} size="xl" className="mb-3 opacity-25" />
              <h5 className="fw-semibold">No data found</h5>
              <p className="small mb-0">No recent analysis results available on the dashboard.</p>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  );
};

export default Dashboard;
