import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { WorkshopData } from '../types/workshop';

/**
 * Generates a PDF summary of the workshop data
 */
export const exportWorkshopToPdf = async (workshopData: WorkshopData): Promise<void> => {
  // Create a temporary container for the HTML content
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.width = '700px';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Generate HTML content for the PDF
  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 5px;">Offer Breakthrough Workshop Summary</h1>
      <p style="color: #666; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Big Idea</h2>
      <p><strong>Initial Concept:</strong> ${workshopData.bigIdea?.description?.replace(/\n/g, '<br>') || 'Not defined'}</p>
      <p><strong>Target Customers:</strong> ${workshopData.bigIdea?.targetCustomers?.replace(/\n/g, '<br>') || 'Not defined'}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Underlying Goal</h2>
      <p><strong>Business Goal:</strong> ${workshopData.underlyingGoal?.businessGoal?.replace(/\n/g, '<br>') || 'Not defined'}</p>
      <p><strong>Constraints:</strong> ${workshopData.underlyingGoal?.constraints?.replace(/\n/g, '<br>') || 'Not defined'}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Trigger Events</h2>
      <ul>
        ${workshopData.triggerEvents.map(event => `<li>${event.description}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Jobs to be Done</h2>
      <ul>
        ${workshopData.jobs.map(job => `<li>${job.description}${job.selected ? ' (Selected)' : ''}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Target Buyers</h2>
      <ul>
        ${workshopData.targetBuyers.map(buyer => `<li>${buyer.description}${buyer.selected ? ' (Selected)' : ''}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Pain Points</h2>
      <ul>
        ${workshopData.pains.map(pain => `
          <li>
            <strong>${pain.description}</strong><br>
            <span style="font-size: 12px; color: #666;">
              Type: ${pain.type}, Buyer: ${pain.buyerSegment || 'All segments'}
              ${pain.isFire ? ' (FIRE Pain)' : ''}
            </span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Problem Focus</h2>
      <p><strong>Target Moment:</strong> ${workshopData.problemUp?.targetMoment?.replace(/\n/g, '<br>') || 'Not defined'}</p>
      <p><strong>Selected Pains:</strong></p>
      <ul>
        ${(workshopData.problemUp?.selectedPains || []).map(id => {
          const pain = workshopData.pains.find(p => p.id === id);
          return pain ? `<li>${pain.description}</li>` : '';
        }).join('')}
      </ul>
      <p><strong>Selected Buyers:</strong></p>
      <ul>
        ${(workshopData.problemUp?.selectedBuyers || []).map(id => {
          const buyer = workshopData.targetBuyers.find(b => b.id === id);
          return buyer ? `<li>${buyer.description}</li>` : '';
        }).join('')}
      </ul>
      <p><strong>Notes:</strong> ${workshopData.problemUp?.notes?.replace(/\n/g, '<br>') || 'None'}</p>
      ${workshopData.painstormingResults?.ahaMoments ? `<p><strong>'Aha!' Moments & Reflections:</strong> ${workshopData.painstormingResults.ahaMoments.replace(/\n/g, '<br>')}</p>` : ''}
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Refined Offer</h2>
      <div style="white-space: pre-wrap; line-height: 1.5; margin-bottom: 15px;">
        ${workshopData.refinedIdea?.description?.replace(/\n/g, '<br>') || 'Not defined'}
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Next Steps</h2>

      <p><strong>Pre-Sell Plan:</strong></p>
      ${workshopData.nextSteps?.preSellPlanItems && workshopData.nextSteps.preSellPlanItems.length > 0
        ? `<ul>${workshopData.nextSteps.preSellPlanItems.map(item => `<li>${item}</li>`).join('')}</ul>`
        : `<p>${workshopData.nextSteps?.preSellPlan || 'Not defined'}</p>`
      }

      <p><strong>Workshop Reflections:</strong></p>
      ${workshopData.nextSteps?.workshopReflectionItems && workshopData.nextSteps.workshopReflectionItems.length > 0
        ? `<ul>${workshopData.nextSteps.workshopReflectionItems.map(item => `<li>${item}</li>`).join('')}</ul>`
        : `<p>${workshopData.nextSteps?.workshopReflections || 'Not defined'}</p>`
      }
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Reflections & Action Plan</h2>
      <p><strong>Key Insights & Learnings:</strong> ${workshopData.reflections?.keyInsights || 'None'}</p>
      <p><strong>Actionable Next Steps:</strong> ${workshopData.reflections?.nextSteps || 'None'}</p>
      <p><strong>Personal Reflection:</strong> ${workshopData.reflections?.personalReflection || 'None'}</p>
    </div>
  `;

  try {
    // Convert the HTML to a canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true
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
        pdf.addImage(imgData, 'PNG', 0, -(currentHeight), imgWidth, imgHeight);
        currentHeight += 297;
      }
    }

    // Save the PDF
    pdf.save('offer-breakthrough-workshop-summary.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
};
