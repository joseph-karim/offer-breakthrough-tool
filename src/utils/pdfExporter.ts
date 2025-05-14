import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { WorkshopData } from '../types/workshop';

/**
 * Generates a PDF summary of the workshop data
 */
export const exportWorkshopToPdf = async (workshopData: WorkshopData): Promise<void> => {
  // Create a temporary container for the HTML content
  const container = document.createElement('div');
  container.style.padding = '30px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.width = '700px';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Generate HTML content for the PDF
  container.innerHTML = `
    <div style="background-color: #1E1E1E; padding: 20px; text-align: center; margin-bottom: 30px; border-radius: 10px;">
      <div style="display: flex; justify-content: center; align-items: center;">
        <img src="/assets/Buyer Breakthrough Logo.png" alt="Buyer Breakthrough Logo" style="max-width: 250px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" />
      </div>
      <h1 style="color: white; font-size: 24px; margin: 10px 0 5px 0;">Workshop Summary</h1>
      <p style="color: #fcf720; font-size: 14px; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Big Idea</h2>
      </div>
      <p><strong>Initial Concept:</strong> ${workshopData.bigIdea?.description?.replace(/\n/g, '<br>') || 'Not defined'}</p>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Underlying Goal</h2>
      </div>
      <p><strong>Business Goal:</strong> ${workshopData.underlyingGoal?.businessGoal?.replace(/\n/g, '<br>') || 'Not defined'}</p>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Trigger Events</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${(() => {
          // Split trigger events into chunks of 10 items for better page breaks
          const events = workshopData.triggerEvents;
          if (events.length <= 10) {
            return events.map(event => `<li style="margin-bottom: 8px;">${event.description}</li>`).join('');
          }

          let result = '';
          for (let i = 0; i < events.length; i++) {
            result += `<li style="margin-bottom: 8px;">${events[i].description}</li>`;

            // Add a page break hint after every 10 items (except the last chunk)
            if ((i + 1) % 10 === 0 && i < events.length - 1) {
              result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin-top: 10px;">`;
            }
          }
          return result;
        })()}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Jobs to be Done</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${(() => {
          // Split jobs into chunks of 8 items for better page breaks
          const jobs = workshopData.jobs;
          if (jobs.length <= 8) {
            return jobs.map(job => `
              <li style="margin-bottom: 8px;">
                ${job.description}
              </li>
            `).join('');
          }

          let result = '';
          for (let i = 0; i < jobs.length; i++) {
            result += `
              <li style="margin-bottom: 8px;">
                ${jobs[i].description}
              </li>
            `;

            // Add a page break hint after every 8 items (except the last chunk)
            if ((i + 1) % 8 === 0 && i < jobs.length - 1) {
              result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin-top: 10px;">`;
            }
          }
          return result;
        })()}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Target Buyers</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${(() => {
          // Split buyers into chunks of 8 items for better page breaks
          const buyers = workshopData.targetBuyers;
          if (buyers.length <= 8) {
            return buyers.map(buyer => `
              <li style="margin-bottom: 8px;">
                ${buyer.description}
              </li>
            `).join('');
          }

          let result = '';
          for (let i = 0; i < buyers.length; i++) {
            result += `
              <li style="margin-bottom: 8px;">
                ${buyers[i].description}
              </li>
            `;

            // Add a page break hint after every 8 items (except the last chunk)
            if ((i + 1) % 8 === 0 && i < buyers.length - 1) {
              result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin-top: 10px;">`;
            }
          }
          return result;
        })()}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid; page-break-before: always;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Pain Points</h2>
      </div>
      ${workshopData.painstormingResults ? `
        <div style="margin-bottom: 15px;">
          ${workshopData.painstormingResults.buyerSegment1 ? `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">${workshopData.painstormingResults.buyerSegment1}:</h3>
              <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${workshopData.painstormingResults.buyer1Pains.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          ${workshopData.painstormingResults.buyerSegment2 ? `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">${workshopData.painstormingResults.buyerSegment2}:</h3>
              <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${workshopData.painstormingResults.buyer2Pains.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          ${workshopData.painstormingResults.buyerSegment3 ? `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">${workshopData.painstormingResults.buyerSegment3}:</h3>
              <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${workshopData.painstormingResults.buyer3Pains.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          ${workshopData.painstormingResults.overlappingPains ? `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Overlapping Pains:</h3>
              <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${workshopData.painstormingResults.overlappingPains.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          ${workshopData.painstormingResults.ahaMoments ? `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">'Aha!' Moments & Reflections:</h3>
              <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${workshopData.painstormingResults.ahaMoments.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
        </div>
      ` : `
        <ul style="padding-left: 20px; margin-top: 10px;">
          ${workshopData.pains && workshopData.pains.length > 0 ?
            workshopData.pains.map(pain => `
              <li style="margin-bottom: 12px;">
                <strong>${pain.description}</strong><br>
                <div style="font-size: 12px; color: #4b5563; margin-top: 4px;">
                  <span style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 10px; margin-right: 5px;">Type: ${pain.type}</span>
                  <span style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 10px; margin-right: 5px;">Buyer: ${pain.buyerSegment || 'All segments'}</span>
                  ${pain.isFire ? '<span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 10px;">FIRE Pain</span>' : ''}
                </div>
              </li>
            `).join('') :
            '<li>No pain points defined yet</li>'
          }
        </ul>
      `}
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Problem Focus</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Target Problems:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(() => {
            // Get selected problems
            const problems = (workshopData.targetProblems || []).filter(problem => problem.selected);

            if (problems.length <= 6) {
              return problems.map(problem => {
                // Check if this problem is a FIRE problem (contains 🔥 emoji)
                const isFire = problem.description.includes('🔥');
                // Remove the fire emoji from the description if present
                const cleanDescription = isFire ? problem.description.replace('🔥', '') : problem.description;

                return `
                  <li style="margin-bottom: 12px;">
                    ${cleanDescription}
                    ${isFire ? '<div style="margin-top: 4px;"><span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px;">FIRE Problem</span></div>' : ''}
                  </li>
                `;
              }).join('');
            }

            let result = '';
            for (let i = 0; i < problems.length; i++) {
              const problem = problems[i];
              const isFire = problem.description.includes('🔥');
              const cleanDescription = isFire ? problem.description.replace('🔥', '') : problem.description;

              result += `
                <li style="margin-bottom: 12px;">
                  ${cleanDescription}
                  ${isFire ? '<div style="margin-top: 4px;"><span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px;">FIRE Problem</span></div>' : ''}
                </li>
              `;

              // Add a page break hint after every 6 items (except the last chunk)
              if ((i + 1) % 6 === 0 && i < problems.length - 1) {
                result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin: 0;">`;
              }
            }
            return result;
          })()}
        </ul>
      </div>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid; page-break-before: always;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Target Market Profile</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Market Name:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.targetMarketProfile?.name || 'Not defined'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Common Traits:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(() => {
            const traits = workshopData.targetMarketProfile?.commonTraits || [];
            if (traits.length <= 8) {
              return traits.map(trait => `<li style="margin-bottom: 8px;">${trait}</li>`).join('');
            }

            let result = '';
            for (let i = 0; i < traits.length; i++) {
              result += `<li style="margin-bottom: 8px;">${traits[i]}</li>`;

              // Add a page break hint after every 8 items (except the last chunk)
              if ((i + 1) % 8 === 0 && i < traits.length - 1) {
                result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin: 0;">`;
              }
            }
            return result;
          })()}
        </ul>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Common Triggers:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(() => {
            const triggers = workshopData.targetMarketProfile?.commonTriggers || [];
            if (triggers.length <= 8) {
              return triggers.map(trigger => `<li style="margin-bottom: 8px;">${trigger}</li>`).join('');
            }

            let result = '';
            for (let i = 0; i < triggers.length; i++) {
              result += `<li style="margin-bottom: 8px;">${triggers[i]}</li>`;

              // Add a page break hint after every 8 items (except the last chunk)
              if ((i + 1) % 8 === 0 && i < triggers.length - 1) {
                result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin: 0;">`;
              }
            }
            return result;
          })()}
        </ul>
      </div>


    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid; page-break-before: always;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Refined Big Idea</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Description:</h3>
        <div style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; line-height: 1.5;">
          ${workshopData.refinedIdea?.description?.replace(/\n/g, '<br>') || workshopData.offer?.description || 'Not defined'}
        </div>
      </div>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; page-break-inside: avoid; page-break-before: always;">
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Next Steps</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Pre-Sell Plan:</h3>
        ${workshopData.nextSteps?.preSellPlanItems && workshopData.nextSteps.preSellPlanItems.length > 0
          ? `<ul style="padding-left: 20px; margin: 0;">
              ${(() => {
                const items = workshopData.nextSteps.preSellPlanItems;
                if (items.length <= 8) {
                  return items.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('');
                }

                let result = '';
                for (let i = 0; i < items.length; i++) {
                  result += `<li style="margin-bottom: 8px;">${items[i]}</li>`;

                  // Add a page break hint after every 8 items (except the last chunk)
                  if ((i + 1) % 8 === 0 && i < items.length - 1) {
                    result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin: 0;">`;
                  }
                }
                return result;
              })()}
            </ul>`
          : `<p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.nextSteps?.preSellPlan || 'Not defined'}</p>`
        }
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Workshop Reflections:</h3>
        ${workshopData.nextSteps?.workshopReflectionItems && workshopData.nextSteps.workshopReflectionItems.length > 0
          ? `<ul style="padding-left: 20px; margin: 0;">
              ${(() => {
                const items = workshopData.nextSteps.workshopReflectionItems;
                if (items.length <= 8) {
                  return items.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('');
                }

                let result = '';
                for (let i = 0; i < items.length; i++) {
                  result += `<li style="margin-bottom: 8px;">${items[i]}</li>`;

                  // Add a page break hint after every 8 items (except the last chunk)
                  if ((i + 1) % 8 === 0 && i < items.length - 1) {
                    result += `</ul><div style="page-break-after: auto;"></div><ul style="padding-left: 20px; margin: 0;">`;
                  }
                }
                return result;
              })()}
            </ul>`
          : `<p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.nextSteps?.workshopReflections || 'Not defined'}</p>`
        }
      </div>
    </div>

    <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
      <div style="display: inline-block; background-color: #1E1E1E; padding: 15px 30px; border-radius: 10px;">
        <img src="/assets/bomb.png" alt="Bomb icon" style="width: 30px; height: 30px; margin-right: 10px; vertical-align: middle;" />
        <span style="color: white; font-size: 16px; font-weight: bold; vertical-align: middle;">Buyer Breakthrough Workshop</span>
      </div>
    </div>
  `;

  try {
    // Load the logo image first
    const logoImg = new Image();
    logoImg.src = '/assets/Buyer Breakthrough Logo.png';
    const bombImg = new Image();
    bombImg.src = '/assets/bomb.png';

    // Wait for images to load
    await Promise.all([
      new Promise(resolve => { logoImg.onload = resolve; }),
      new Promise(resolve => { bombImg.onload = resolve; })
    ]);

    // Convert the HTML to a canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 15000 // Increase timeout for image loading
    });

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate the width and height to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // If the content is longer than one page, add more pages
    if (imgHeight > 297) { // A4 height in mm
      let currentHeight = 297;
      while (currentHeight < imgHeight) {
        pdf.addPage();
        // Add a 10mm margin at the top of each page to prevent content from being cut off
        pdf.addImage(imgData, 'PNG', 0, -(currentHeight - 10), imgWidth, imgHeight);
        currentHeight += 297;
      }
    }

    // Save the PDF
    pdf.save('buyer-breakthrough-workshop-summary.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
};
