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
      <img src="/assets/Buyer Breakthrough Logo.png" alt="Buyer Breakthrough Logo" style="max-width: 250px; height: auto; margin-bottom: 10px;" />
      <h1 style="color: white; font-size: 24px; margin: 10px 0 5px 0;">Workshop Summary</h1>
      <p style="color: #fcf720; font-size: 14px; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">1</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Big Idea</h2>
      </div>
      <p><strong>Initial Concept:</strong> ${workshopData.bigIdea?.description?.replace(/\n/g, '<br>') || 'Not defined'}</p>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Underlying Goal</h2>
      </div>
      <p><strong>Business Goal:</strong> ${workshopData.underlyingGoal?.businessGoal?.replace(/\n/g, '<br>') || 'Not defined'}</p>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Trigger Events</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${workshopData.triggerEvents.map(event => `<li style="margin-bottom: 8px;">${event.description}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">4</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Jobs to be Done</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${workshopData.jobs.map(job => `
          <li style="margin-bottom: 8px;">
            ${job.description}
            ${job.isOverarching ? '<span style="background-color: #fcf720; color: black; font-size: 12px; padding: 2px 6px; border-radius: 10px; margin-left: 5px;">Overarching</span>' : ''}
            ${job.selected && !job.isOverarching ? '<span style="background-color: #e5e7eb; color: #4b5563; font-size: 12px; padding: 2px 6px; border-radius: 10px; margin-left: 5px;">Selected</span>' : ''}
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">5</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Target Buyers</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${workshopData.targetBuyers.map(buyer => `
          <li style="margin-bottom: 8px;">
            ${buyer.description}
            ${buyer.selected ? '<span style="background-color: #e5e7eb; color: #4b5563; font-size: 12px; padding: 2px 6px; border-radius: 10px; margin-left: 5px;">Selected</span>' : ''}
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">6</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Pain Points</h2>
      </div>
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${workshopData.pains.map(pain => `
          <li style="margin-bottom: 12px;">
            <strong>${pain.description}</strong><br>
            <div style="font-size: 12px; color: #4b5563; margin-top: 4px;">
              <span style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 10px; margin-right: 5px;">Type: ${pain.type}</span>
              <span style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 10px; margin-right: 5px;">Buyer: ${pain.buyerSegment || 'All segments'}</span>
              ${pain.isFire ? '<span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 10px;">FIRE Pain</span>' : ''}
            </div>
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">7</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Problem Focus</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Target Moment:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.problemUp?.targetMoment?.replace(/\n/g, '<br>') || 'Not defined'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Selected Pains:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(workshopData.problemUp?.selectedPains || []).map(id => {
            const pain = workshopData.pains.find(p => p.id === id);
            return pain ? `<li style="margin-bottom: 8px;">${pain.description}</li>` : '';
          }).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Selected Buyers:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(workshopData.problemUp?.selectedBuyers || []).map(id => {
            const buyer = workshopData.targetBuyers.find(b => b.id === id);
            return buyer ? `<li style="margin-bottom: 8px;">${buyer.description}</li>` : '';
          }).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Target Problems:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(workshopData.targetProblems || []).filter(problem => problem.selected).map(problem =>
            `<li style="margin-bottom: 8px;">${problem.description}</li>`
          ).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Notes:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.problemUp?.notes?.replace(/\n/g, '<br>') || 'None'}</p>
      </div>

      ${workshopData.painstormingResults?.ahaMoments ? `
        <div style="margin-bottom: 15px;">
          <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">'Aha!' Moments & Reflections:</h3>
          <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.painstormingResults.ahaMoments.replace(/\n/g, '<br>')}</p>
        </div>
      ` : ''}
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">8</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Target Market Profile</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Market Name:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.targetMarketProfile?.name || 'Not defined'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Common Traits:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(workshopData.targetMarketProfile?.commonTraits || []).map(trait =>
            `<li style="margin-bottom: 8px;">${trait}</li>`
          ).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Common Triggers:</h3>
        <ul style="padding-left: 20px; margin: 0;">
          ${(workshopData.targetMarketProfile?.commonTriggers || []).map(trigger =>
            `<li style="margin-bottom: 8px;">${trigger}</li>`
          ).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Core Transformation:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.targetMarketProfile?.coreTransformation || 'Not defined'}</p>
      </div>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">9</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Refined Offer</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Name:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.refinedIdea?.name || workshopData.offer?.name || 'Not defined'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Format:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.refinedIdea?.format || workshopData.offer?.format || 'Not defined'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Description:</h3>
        <div style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; line-height: 1.5;">
          ${workshopData.refinedIdea?.description?.replace(/\n/g, '<br>') || workshopData.offer?.description || 'Not defined'}
        </div>
      </div>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">10</div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Next Steps</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Pre-Sell Plan:</h3>
        ${workshopData.nextSteps?.preSellPlanItems && workshopData.nextSteps.preSellPlanItems.length > 0
          ? `<ul style="padding-left: 20px; margin: 0;">${workshopData.nextSteps.preSellPlanItems.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>`
          : `<p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.nextSteps?.preSellPlan || 'Not defined'}</p>`
        }
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Workshop Reflections:</h3>
        ${workshopData.nextSteps?.workshopReflectionItems && workshopData.nextSteps.workshopReflectionItems.length > 0
          ? `<ul style="padding-left: 20px; margin: 0;">${workshopData.nextSteps.workshopReflectionItems.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}</ul>`
          : `<p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.nextSteps?.workshopReflections || 'Not defined'}</p>`
        }
      </div>
    </div>

    <div style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="background-color: #fcf720; color: black; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
        <h2 style="color: #1e293b; font-size: 20px; margin: 0; font-weight: 600;">Reflections & Action Plan</h2>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Key Insights & Learnings:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.reflections?.keyInsights?.replace(/\n/g, '<br>') || 'None'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Actionable Next Steps:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.reflections?.nextSteps?.replace(/\n/g, '<br>') || 'None'}</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Personal Reflection:</h3>
        <p style="margin: 0; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #e5e7eb;">${workshopData.reflections?.personalReflection?.replace(/\n/g, '<br>') || 'None'}</p>
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
        pdf.addImage(imgData, 'PNG', 0, -(currentHeight), imgWidth, imgHeight);
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
