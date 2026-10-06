# UX Specification: Investment Appraisal Workspace

สถานะ: พร้อมสำหรับวางแผนพัฒนา  
ขอบเขต: Version ถัดจาก Finance Manager Calculator V1  
ผู้ใช้หลัก: Finance Manager ในบทบาทผู้วิเคราะห์ (Analyst)

## Problem Statement

Version แรกเป็นเครื่องคิดเลขแยกตามสูตร ผู้วิเคราะห์ต้องแปลงข้อมูลจากแหล่งงานจริงให้อยู่ในรูปข้อความ กรอกข้อมูลซ้ำเมื่อต้องการใช้ NPV และ IRR และไม่สามารถรักษาข้อมูลเมื่อสลับเครื่องมือหรือเปรียบเทียบหลายสถานการณ์ได้ ผลลัพธ์เป็นตัวเลขเดี่ยวพร้อมคำอธิบายทั่วไป จึงยังไม่เพียงพอสำหรับตรวจสอบสมมติฐาน วิเคราะห์ทางเลือก และจัดทำข้อสรุปเพื่อเสนอผู้อนุมัติ

ปัญหาที่ต้องแก้ใน Version นี้ไม่ใช่เพียงทำให้กรอกสูตรได้ง่ายขึ้น แต่คือทำให้ผู้วิเคราะห์สามารถทำงานตั้งแต่เริ่มชุดวิเคราะห์จนถึง Review & Export ได้ใน flow เดียว โดยไม่ต้องย้ายข้อมูลไปมาระหว่างเครื่องคิดเลขหลายตัว

## Solution

สร้าง Investment Appraisal Workspace แบบ Desktop-first ซึ่งมีหน่วยงานหลักเป็นชุดวิเคราะห์ (Analysis Case) หนึ่งชุด ภายในประกอบด้วยข้อมูลโครงการ กรณีฐาน (Base Case) สถานการณ์เปรียบเทียบ ตาราง Cash Flow ผลคำนวณ และข้อสรุปเพื่อการตัดสินใจ

ประสบการณ์หลักเรียงตามลำดับ:

1. เริ่มหรือเปิดชุดวิเคราะห์
2. ระบุข้อมูลโครงการและเกณฑ์การประเมิน
3. กรอกหรือวาง Cash Flow จาก Excel
4. ตรวจผล NPV, IRR และ Payback ระหว่างทำงาน
5. Duplicate กรณีฐานเพื่อสร้างสถานการณ์เปรียบเทียบ
6. เปรียบเทียบผลและย้อนกลับไปแก้สมมติฐานต้นทาง
7. เขียนข้อสรุป ตรวจความพร้อม และ Export

ระบบช่วยคำนวณ ตรวจความครบถ้วน และชี้ความต่าง แต่ไม่ตัดสินใจอนุมัติหรือปฏิเสธแทนผู้วิเคราะห์

## Experience Principles

### 1. One case, one decision context

ข้อมูลทั้งหมดของการตัดสินใจหนึ่งเรื่องต้องอยู่ในชุดวิเคราะห์เดียว ไม่แยก NPV และ IRR เป็นคนละเครื่องมือ

### 2. Familiar to finance users

ตาราง Cash Flow ต้องมีพฤติกรรมใกล้เคียง Spreadsheet: ช่วงเวลาเป็นคอลัมน์ รายการเป็นแถว ตัวเลขชิดขวา ใช้แป้น Tab/Enter ได้ และวางข้อมูลหลายช่องจาก Excel ได้

### 3. Results never become stale

เมื่อข้อมูลเปลี่ยน ผลลัพธ์ต้องคำนวณใหม่จากข้อมูลชุดเดียวกัน หากข้อมูลไม่ครบหรือผิด ผลเดิมต้องไม่ถูกแสดงเหมือนยังใช้ได้

### 4. Explain, do not prescribe

ข้อความและสีอธิบายผลเทียบกับเกณฑ์ที่ผู้วิเคราะห์กำหนด ไม่ใช้คำว่า “ควรลงทุน”, “ควรอนุมัติ” หรือข้อความที่ตีความเป็นคำแนะนำอัตโนมัติ

### 5. Progressive disclosure

ระหว่างกรอกข้อมูลให้เห็นเฉพาะตัวชี้วัดหลัก ส่วนสูตร รายละเอียดการคำนวณ และคำอธิบายเชิงลึกอยู่ในหน้าวิเคราะห์ผลและ Review

### 6. Compact without becoming cryptic

หน้าจอใช้ความหนาแน่นแบบ Professional Compact แต่ต้องแบ่งกลุ่มข้อมูลชัดเจน ใช้คำอธิบาย ณ จุดที่ต้องใช้ และไม่ซ่อน action หลักไว้ในเมนูที่ค้นพบยาก

## Primary User Journey

### 1. Home

หน้าแรกมีสามจุดเริ่มต้น:

- **สร้างชุดวิเคราะห์ใหม่**: action หลัก
- **งานล่าสุด**: เรียงตามเวลาที่แก้ไขล่าสุด
- **ทดลองด้วยข้อมูลตัวอย่าง**: action รองและแยกจากงานจริงอย่างชัดเจน

แต่ละงานล่าสุดแสดงชื่อโครงการ ผู้จัดทำ วันที่แก้ไขล่าสุด จำนวนสถานการณ์ และสถานะความพร้อมของชุดวิเคราะห์ ผู้วิเคราะห์สามารถเปิดงานเดิมหรือ Duplicate เป็นงานใหม่ได้

ข้อมูลตัวอย่างต้องมีป้าย “ข้อมูลตัวอย่าง” ที่มองเห็นตลอดเวลา และไม่ปะปนกับงานจริงโดยไม่มีการยืนยันตั้งชื่อใหม่

### 2. Create Analysis Case

การเริ่มงานใหม่ถามเฉพาะข้อมูลที่จำเป็นก่อนเข้าสู่ Workspace:

- ชื่อโครงการ
- ความถี่ของ Cash Flow: รายเดือน รายไตรมาส หรือรายปี

หลังจากนั้นผู้วิเคราะห์เข้าสู่ Workspace ทันที ข้อมูลประกอบอื่นกรอกภายหลังได้โดยไม่ต้องผ่าน Wizard ยาว

### 3. Workspace Navigation

Workspace มี navigation หลักที่ข้ามไปมาได้:

1. **ข้อมูลโครงการ**
2. **Cash Flow**
3. **วิเคราะห์ผล**
4. **เปรียบเทียบสถานการณ์**
5. **Review & Export**

Header แสดงชื่อชุดวิเคราะห์ สถานะการบันทึก และ action ที่เกี่ยวข้องกับงานทั้งชุด เช่น Duplicate, Import และ Export โดยไม่แย่งความเด่นจากงานในหน้าปัจจุบัน

### 4. Project Information

ข้อมูลโครงการประกอบด้วย:

- ชื่อโครงการ
- ผู้จัดทำ
- วันที่ประเมิน
- สกุลเงิน
- ความถี่ของ Cash Flow
- อัตราคิดลด (Discount Rate)
- อัตราผลตอบแทนขั้นต่ำ (Hurdle Rate)
- แหล่งที่มาของสมมติฐาน
- หมายเหตุ

ภาษาไทยเป็นหลักและแสดงศัพท์การเงินภาษาอังกฤษในวงเล็บเมื่อต้องช่วยให้ตรงกับเอกสารงานจริง

### 5. Cash Flow Workspace

ตารางวางช่วงเวลาเป็นคอลัมน์และรายการเป็นแถว อย่างน้อยประกอบด้วย:

- เงินลงทุน (Investment)
- กระแสเงินสดรับ (Cash Inflow)
- กระแสเงินสดจ่าย (Cash Outflow)
- กระแสเงินสดสุทธิ (Net Cash Flow) ซึ่งระบบคำนวณให้
- หมายเหตุของแต่ละช่วงเวลา

ผู้วิเคราะห์สามารถ:

- เพิ่มหรือลดช่วงเวลา
- ใช้ Tab และ Enter เพื่อเคลื่อนที่ระหว่างช่อง
- วางค่าหลายช่องจาก Excel
- คัดลอกช่วงข้อมูลกลับไปยัง Spreadsheet
- เห็นรูปแบบตัวเลขและค่าติดลบอย่างสม่ำเสมอ
- เห็นตำแหน่งผิดพลาดติดกับเซลล์หรือแถวที่มีปัญหา

หน้า Desktop มีแถบสรุปแบบติดอยู่ด้านข้าง แสดง NPV, IRR, Payback Period และ Discounted Payback Period ของสถานการณ์ปัจจุบัน เมื่อข้อมูลไม่พร้อม แถบนี้แสดงสถานะที่อธิบายสาเหตุแทนตัวเลขเก่า

### 6. Scenario Workflow

ชุดวิเคราะห์ใหม่มีกรณีฐานเพียงหนึ่งสถานการณ์ ผู้วิเคราะห์สร้างสถานการณ์อื่นด้วยการ Duplicate กรณีฐาน แล้วตั้งชื่อได้อย่างอิสระ เช่น Best Case หรือ Downside Case

เมื่อแก้สถานการณ์ที่ Duplicate มา ระบบต้อง:

- แสดงว่าค่าใดต่างจากกรณีฐาน
- อนุญาตให้คืนค่าเฉพาะจุดกลับเป็นกรณีฐาน
- รักษาตำแหน่งการทำงานเมื่อสลับสถานการณ์
- ไม่ทำให้ข้อมูลในสถานการณ์อื่นเปลี่ยนตามโดยไม่แจ้ง

การลบสถานการณ์ต้องยืนยันเมื่อจะสูญเสียข้อมูลที่ผู้วิเคราะห์แก้เอง กรณีฐานไม่สามารถลบได้จนกว่าจะกำหนดสถานการณ์อื่นเป็นกรณีฐาน

### 7. Results Analysis

หน้าวิเคราะห์ผลแสดง:

- NPV
- IRR
- Payback Period
- Discounted Payback Period
- Profitability Index เป็นข้อมูลรอง
- สมมติฐานสำคัญที่ใช้
- ตารางรายละเอียดการคำนวณ
- สูตรและคำอธิบายแบบเปิดดูเพิ่มเติมได้

สถานะของตัวชี้วัดใช้ข้อความเป็นกลาง เช่น “สูงกว่า Hurdle Rate 2.4 จุดเปอร์เซ็นต์” หรือ “NPV ต่ำกว่าศูนย์” สีทำหน้าที่เสริมความหมายและต้องไม่เป็นช่องทางเดียวที่ใช้สื่อสถานะ

### 8. Scenario Comparison

หน้าเปรียบเทียบใช้สถานการณ์เป็นคอลัมน์และตัวชี้วัดเป็นแถว โดยกรณีฐานถูกระบุชัดเจน แต่ละค่าที่เปรียบเทียบได้แสดงความต่างจากกรณีฐาน

ผู้วิเคราะห์สามารถคลิกชื่อสถานการณ์หรือค่าที่ผิดปกติเพื่อกลับไปยังสมมติฐานหรือ Cash Flow ต้นทาง เมื่อแก้ไขเสร็จและกลับมา หน้าเปรียบเทียบต้องคืนตำแหน่งเดิม

ด้านล่างมีพื้นที่ให้ผู้วิเคราะห์เขียน:

- ข้อค้นพบสำคัญ
- ความเสี่ยงและข้อควรระวัง
- ข้อเสนอแนะของผู้วิเคราะห์

ระบบไม่สร้างคำตัดสินอนุมัติหรือปฏิเสธเอง

### 9. Review & Export

หน้าสุดท้ายแสดง Preview ของข้อสรุปเพื่อการตัดสินใจ และ Checklist ความพร้อมของชุดวิเคราะห์:

- ข้อมูลโครงการที่จำเป็นครบหรือไม่
- ทุกสถานการณ์คำนวณได้หรือไม่
- มีค่าผิดปกติหรือคำเตือนที่ยังไม่ตรวจสอบหรือไม่
- สมมติฐานสำคัญมีแหล่งอ้างอิงหรือไม่
- มีข้อสรุปของผู้วิเคราะห์หรือไม่

คำเตือนทั่วไปไม่ควรบล็อกการ Export แต่ต้องระบุในผลส่งออกว่าเอกสารยังมีรายการต้องตรวจสอบ ข้อผิดพลาดที่ทำให้ผลคำนวณไม่ถูกต้องต้องบล็อกการ Export ผลลัพธ์ทางการเงินจนกว่าจะได้รับการแก้ไข

การ Export หลักคือ Excel ซึ่งมี:

1. `Decision Summary`
2. `Scenario Comparison`
3. `Cash Flow Detail`
4. `Assumptions`

นอกจากนี้มี action คัดลอกข้อสรุปเป็นข้อความสำหรับนำไปใช้ในอีเมลหรือสไลด์

## Content and Feedback Rules

### Labels and terminology

- ใช้คำใน `GLOSSARY.md` อย่างสม่ำเสมอ
- ภาษาไทยเป็นหลัก และใช้ศัพท์อังกฤษในวงเล็บเฉพาะคำที่ผู้ใช้ Finance พบในงานจริง
- หลีกเลี่ยงคำทั่วไปที่ไม่ระบุการกระทำ เช่น “ดำเนินการ” หรือ “ยืนยัน” เมื่อสามารถใช้ “สร้างสถานการณ์” หรือ “Export Excel” ได้

### Empty states

- งานใหม่ต้องว่างและมีคำแนะนำ ไม่เติมตัวเลขตัวอย่างให้เหมือนข้อมูลจริง
- หน้าเปรียบเทียบที่มีเพียงกรณีฐานอธิบายประโยชน์ของการสร้างสถานการณ์และมี action Duplicate Base Case
- งานล่าสุดที่ยังไม่มีข้อมูลแสดง action สร้างงานใหม่และทดลองตัวอย่างแยกกัน

### Validation

- แสดงข้อผิดพลาดติดกับช่อง เซลล์ หรือแถวที่ต้องแก้
- Summary ด้านบนบอกจำนวนปัญหาและพาไปยังจุดแรก
- เมื่อผู้ใช้แก้ปัญหา ข้อความต้องหายโดยไม่ต้อง Submit แบบฟอร์มใหม่
- ไม่แสดงผลลัพธ์เดิมเมื่อข้อมูลต้นทางเปลี่ยนแล้วแต่ยังคำนวณไม่ได้
- ข้อความบอกสิ่งที่เกิดขึ้นและวิธีแก้ ไม่ใช้ชื่อ exception หรือคำเทคนิค

### Save feedback

แสดงสถานะใกล้ชื่อชุดวิเคราะห์:

- กำลังบันทึก
- บันทึกแล้วเมื่อ HH:MM
- บันทึกไม่สำเร็จ — ลองอีกครั้ง

เตือนก่อนออกจากหน้าเฉพาะเมื่อมีข้อมูลที่ยังไม่ได้บันทึกสำเร็จ

### Contextual help

- ไม่ใช้ Product Tour หลายขั้น
- อธิบายคำศัพท์และรูปแบบข้อมูล ณ จุดที่ต้องใช้
- มีตัวอย่างการวางข้อมูลจาก Excel ก่อนการวางครั้งแรก
- คำอธิบายเชิงลึกเปิดดูได้แต่ไม่ขวาง workflow หลัก

## Responsive Experience

### Desktop

- เป็นพื้นที่สร้างและแก้ชุดวิเคราะห์เต็มรูปแบบ
- ตาราง Cash Flow และ Summary Rail อยู่ร่วมกัน
- ตารางเปรียบเทียบใช้พื้นที่แนวนอนได้เต็มที่
- Navigation และ action หลักมองเห็นโดยไม่ต้องเปิดเมนูซ้อนหลายชั้น

### Mobile

- เน้นเปิดงานล่าสุด ดูผล เปรียบเทียบสถานการณ์ และแก้สมมติฐานสำคัญ
- Summary และ Scenario Comparison เปลี่ยนเป็นรายการแนวตั้งที่อ่านได้โดยไม่ซูม
- ตาราง Cash Flow เปิดอ่านรายละเอียดได้ แต่การแก้ไขจำนวนมากควรแนะนำให้ทำบน Desktop
- ไม่มี horizontal navigation ที่ซ่อนรายการโดยไม่มีสัญญาณว่าปัดได้
- action หลักต้องมีพื้นที่สัมผัสเพียงพอและไม่ติดขอบหน้าจอ

## Accessibility Requirements

- ทุก action ใช้งานด้วย Keyboard ได้
- Spreadsheet Grid มีตำแหน่ง Focus ที่มองเห็นได้และลำดับการเคลื่อนที่คาดเดาได้
- สถานะ active, error, selected และ comparison ไม่พึ่งสีอย่างเดียว
- Error เชื่อมโยงกับช่องที่ผิดและประกาศต่อ assistive technology
- เมื่อ action พาผู้ใช้ไปแก้ข้อผิดพลาด Focus ต้องย้ายไปยังจุดนั้น
- ตัวเลขใช้รูปแบบอ่านง่ายที่การขยายข้อความ 200% ไม่ทำให้ทับกัน
- สถานะการบันทึกและความพร้อมเป็นข้อความ ไม่ใช้เฉพาะไอคอน

## User Stories

1. As an Analyst, I want to create an Analysis Case with only essential setup information, so that I can begin analysis without completing a long wizard.
2. As an Analyst, I want to reopen recently edited Analysis Cases, so that I can continue work without locating files manually.
3. As an Analyst, I want to distinguish sample data from real work, so that I do not accidentally use demonstration numbers in an approval package.
4. As an Analyst, I want each Analysis Case to keep project information, assumptions, scenarios, results, and conclusions together, so that the decision context remains complete.
5. As an Analyst, I want to choose monthly, quarterly, or annual Cash Flow periods, so that the analysis matches the source model.
6. As an Analyst, I want the Cash Flow Grid to resemble a Spreadsheet, so that existing finance-working habits transfer to the application.
7. As an Analyst, I want to paste a rectangular range from Excel, so that I do not retype source data cell by cell.
8. As an Analyst, I want to copy Cash Flow data back to a Spreadsheet, so that I can reconcile it with supporting workbooks.
9. As an Analyst, I want to add and remove periods, so that the Analysis Case matches the project horizon.
10. As an Analyst, I want Net Cash Flow to be calculated from its components, so that the relationship between inputs and results is auditable.
11. As an Analyst, I want invalid cells identified in place, so that I know exactly what to correct.
12. As an Analyst, I want stale results removed when inputs become invalid, so that I never mistake an old result for a current one.
13. As an Analyst, I want key metrics visible while editing Cash Flow, so that I can see the effect of an assumption change immediately.
14. As an Analyst, I want calculation details available on demand, so that I can verify results without cluttering the primary workspace.
15. As an Analyst, I want Base Case to be the starting scenario, so that the expected case remains the reference point.
16. As an Analyst, I want to duplicate Base Case into a named Scenario, so that I can explore alternatives without re-entering all assumptions.
17. As an Analyst, I want values changed from Base Case to be visibly marked, so that I can understand what drives a Scenario.
18. As an Analyst, I want to restore an individual value to Base Case, so that I can undo a variance without recreating the Scenario.
19. As an Analyst, I want each Scenario isolated from the others, so that editing one does not silently alter another.
20. As an Analyst, I want NPV and IRR calculated from the same Cash Flow, so that the metrics remain internally consistent.
21. As an Analyst, I want to see Payback and Discounted Payback alongside NPV and IRR, so that I understand both value creation and recovery time.
22. As an Analyst, I want IRR compared with my Hurdle Rate using neutral language, so that the application informs rather than decides.
23. As an Analyst, I want Scenarios compared side by side, so that I can identify the financial impact of changed assumptions.
24. As an Analyst, I want each comparison to show Variance from Base Case, so that I can focus on meaningful differences.
25. As an Analyst, I want to navigate from a comparison value to its source assumption, so that investigation does not require searching through the model.
26. As an Analyst, I want to return to the same comparison position after editing, so that my review flow remains uninterrupted.
27. As an Analyst, I want to write findings, risks, and my recommendation, so that professional judgement remains attributable to me.
28. As an Analyst, I want Analysis Readiness checked before Export, so that incomplete work is visible before distribution.
29. As an Analyst, I want non-blocking warnings preserved in the Export, so that reviewers know which items still require attention.
30. As an Analyst, I want Excel output with summary, comparison, detail, and assumptions sheets, so that the analysis can be audited and extended.
31. As an Analyst, I want to copy a concise Decision Summary, so that I can reuse it in an email or presentation.
32. As an Analyst, I want clear save status, so that I know whether closing the page is safe.
33. As an Analyst, I want to duplicate an existing Analysis Case, so that I can reuse a prior structure without overwriting the original.
34. As an Analyst on Mobile, I want to review results and comparisons in a readable layout, so that I can respond away from my Desktop.
35. As an Analyst using a keyboard, I want predictable Grid navigation and visible Focus, so that data entry remains efficient.
36. As a reviewer, I want results expressed against declared criteria rather than automated approval language, so that accountability remains with the human decision makers.

## Implementation Decisions

- Replace formula-specific calculator state with an Analysis Case model containing project metadata, Base Case, Scenarios, conclusions, warnings, and timestamps.
- Treat Investment Appraisal as one workflow; NPV and IRR consume the same Net Cash Flow series.
- Keep the application account-free in this version. Persist active work locally and support portable Analysis Case Export/Import so work is not locked to one browser.
- Autosave changes after valid state transitions and expose a user-visible save state. Retain unsaved in-memory changes when validation fails.
- Build the Cash Flow editor as an accessible Grid supporting keyboard navigation and rectangular clipboard paste.
- Interpret the entered Discount Rate and Hurdle Rate as annual effective rates. Convert them to the selected period frequency consistently and expose the converted rate in calculation details.
- Calculate Net Cash Flow from Investment, Cash Inflow, and Cash Outflow. Period zero is explicit rather than hidden in a separate field.
- Calculate NPV, IRR, Payback Period, Discounted Payback Period, and Profitability Index through a shared financial calculation module.
- Detect Cash Flow patterns that can produce multiple IRRs and show an explanatory warning instead of presenting one IRR as uniquely authoritative.
- Recalculate metrics whenever valid assumptions or Cash Flow change. Invalidate visible metrics immediately when required data is invalid.
- Store each Scenario as a complete snapshot derived from Base Case, while retaining enough comparison information to mark changed values and restore them individually.
- Build comparison navigation around stable semantic references so a metric or variance can open the relevant source field and return to the original review position.
- Generate Excel with the four agreed worksheets. Calculation cells should use Excel formulas where practical; exported values must include the assumptions and warnings needed to reproduce or challenge the result.
- Use deterministic readiness rules. Readiness is not approval and must never be presented as one.
- Preserve Thai as the primary interface language and centralize financial labels and feedback messages for consistency.
- Keep Break-even, Loan, and Financial Ratio capabilities available only as legacy V1 behavior until they receive separate UX specifications; they do not share the new Investment Appraisal workflow implicitly.

## Testing Decisions

### Primary seam

The main test seam is the user-visible browser workflow across an entire Analysis Case. Tests should operate through rendered controls and observable output rather than internal state or DOM implementation details.

High-value flows:

1. Create a new Analysis Case, paste Cash Flow, and obtain valid metrics.
2. Duplicate Base Case, modify assumptions, and verify Variance from Base Case.
3. Navigate from Scenario Comparison to a source value, edit it, and return to the comparison position.
4. Introduce invalid data and verify that stale metrics disappear and actionable errors appear in context.
5. Complete Review, Export the workbook, and verify the workbook contains the agreed sheets, formulas, assumptions, and warnings.
6. Close and reopen the application and verify the latest saved Analysis Case can be continued.

### Financial calculation seam

The financial calculation module also requires focused behavior tests because small numerical errors carry disproportionate business risk. Tests cover:

- annual, quarterly, and monthly rate conversion
- NPV with explicit period zero
- conventional IRR
- no-root and multiple-sign-change warnings
- Payback and Discounted Payback including no-payback cases
- Profitability Index
- zero values, negative values, long horizons, and rounding boundaries

Tests assert documented business results and tolerances, not a specific numerical algorithm.

### Prior art

The current repository has no automated test suite. This version establishes browser workflow tests as the primary seam and pure financial behavior tests as the only lower-level seam justified by calculation risk.

## Acceptance Criteria

- A Finance Manager can create an Investment Appraisal Analysis Case without encountering an unrelated calculator.
- A rectangular Cash Flow range copied from Excel can be pasted into the Grid and produces the expected period values.
- NPV and IRR always derive from the same visible Net Cash Flow series.
- Editing valid data updates the visible metrics without requiring a Submit button.
- Making required data invalid removes or clearly invalidates prior metrics immediately.
- Base Case can be duplicated into a named Scenario without re-entering unchanged data.
- Values that differ from Base Case are identifiable without relying on color alone.
- Scenario Comparison shows NPV, IRR, Payback, Discounted Payback, and Variance from Base Case.
- A user can move from a comparison value to its source and return to the same review context.
- Review & Export distinguishes blocking calculation errors from non-blocking completeness warnings.
- Exported Excel contains the four agreed worksheets and enough assumptions to audit the results.
- No interface copy states or implies that the system approved or rejected the investment.
- The full creation workflow is usable on Desktop, while results and comparisons are readable on Mobile without zooming.
- The application exposes save status and does not silently discard a Scenario or Analysis Case.

## Out of Scope

- Redesigning Break-even Analysis, Loan Analysis, or Financial Ratio Analysis
- Authentication, cloud accounts, team workspaces, or concurrent collaboration
- Approval routing, electronic signatures, or workflow assignment
- Full revision history or audit log of every edit
- Direct integration with ERP, accounting, banking, or market-data systems
- Full Excel workbook import or formula interpretation; this version supports clipboard paste and its own portable Analysis Case format
- Monte Carlo simulation, sensitivity tornado charts, or probabilistic forecasting
- Automated investment recommendations or approval decisions
- Multiple discount rates across individual periods
- Uneven-date XNPV/XIRR calculations
- Detailed tax, depreciation, working-capital, financing, or accounting sub-models intended to replace the source Financial Model
- Deep mobile editing of wide Cash Flow tables
- Public sharing links or server-hosted Analysis Cases

## Further Notes

- The current V1 remains useful as evidence of formulas and visual direction, but its calculator-by-calculator navigation is not the target information architecture for this scope.
- Existing sample values must not be carried into new real Analysis Cases. Samples remain available only through the explicit demonstration path.
- Before implementation begins, this specification should be split into tracer-bullet delivery tickets that preserve one end-to-end flow rather than tickets divided only by UI component.
- Issue Tracker publication and the `ready-for-agent` label were skipped because this repository has not configured the Matt Pocock skills tracker settings. This file is the authoritative local specification until a tracker is configured.
