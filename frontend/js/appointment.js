/**
 * Panthi Clinic - Dynamic Appointment Booking Wizard Script
 * 
 * This script runs the interactive multi-step booking wizard.
 * It manages:
 * 1. Step transitions and progress bubble indicators.
 * 2. Visual card selection states for Services (Step 1) and Specialists (Step 2).
 * 3. Dynamic Date & Time slot fetching (Step 3) from the server API, checking availability,
 *    and blocking lunch breaks (1:00 PM - 2:00 PM) and dentist collision slots.
 * 4. Submitting reservations (Step 4) to the Express backend database and triggering
 *    Nodemailer confirmations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Wizard Setup & Selectors
    // ----------------------------------------------------
    let currentStep = 1;
    const totalSteps = 4;

    const formSteps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.step-indicator');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const progressLine = document.getElementById('progress-line');
    const bookingForm = document.getElementById('booking-form');

    // Values selectors
    const dateInput = document.getElementById('selected-date-value');
    const timeInput = document.getElementById('selected-time-value');
    const slotsContainer = document.getElementById('slots-container');
    const durationIndicator = document.getElementById('duration-indicator');

    // Service duration display mappings
    const SERVICE_DURATIONS_MINUTES = {
        general: '30m',
        cosmetic: '1h',
        implant: '2h',
        ortho: '1.5h'
    };

    // ----------------------------------------------------
    // 2. Core Wizard Navigation Logic
    // ----------------------------------------------------
    function updateForm() {
        // Toggle step section visibility
        formSteps.forEach((step, idx) => {
            if (idx + 1 === currentStep) {
                step.classList.remove('hidden');
                step.classList.add('block');
            } else {
                step.classList.add('hidden');
                step.classList.remove('block');
            }
        });

        // Update progress bubbles at the top
        indicators.forEach((indicator, idx) => {
            const stepNum = idx + 1;
            if (stepNum === currentStep) {
                indicator.classList.add('bg-primary', 'text-white', 'ring-4', 'ring-primary/10');
                indicator.classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'bg-electric-cyan');
            } else if (stepNum < currentStep) {
                indicator.classList.add('bg-electric-cyan', 'text-white');
                indicator.classList.remove('bg-primary', 'bg-surface-container-high', 'text-on-surface-variant', 'ring-4', 'ring-primary/10');
            } else {
                indicator.classList.add('bg-surface-container-high', 'text-on-surface-variant');
                indicator.classList.remove('bg-primary', 'bg-electric-cyan', 'text-white', 'ring-4', 'ring-primary/10');
            }
        });

        // Toggle back button visibility
        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        // Adjust CTA text at the final step
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = 'Confirm Appointment <span class="material-symbols-outlined">check_circle</span>';
        } else {
            nextBtn.innerHTML = 'Next Step <span class="material-symbols-outlined">arrow_forward</span>';
        }

        // Calculate and animate progress bar track width
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (progressLine) {
            progressLine.style.width = `${progress}%`;
        }
    }

    // ----------------------------------------------------
    // 3. Selection Highlighting System (UX enhancements)
    // ----------------------------------------------------

    // Step 1: Highlight Selected Service Cards
    const serviceRadioInputs = document.querySelectorAll('input[name="service"]');
    serviceRadioInputs.forEach(input => {
        input.addEventListener('change', () => {
            serviceRadioInputs.forEach(radio => {
                const label = radio.closest('label');
                if (label) {
                    label.classList.remove('border-electric-cyan', 'bg-electric-cyan/5', 'shadow-md');
                    label.classList.add('border-outline-variant');
                }
            });

            if (input.checked) {
                const activeLabel = input.closest('label');
                if (activeLabel) {
                    activeLabel.classList.add('border-electric-cyan', 'bg-electric-cyan/5', 'shadow-md');
                    activeLabel.classList.remove('border-outline-variant');
                }
            }
        });
    });

    // Step 2: Highlight Selected Specialist Cards
    const specialistRadioInputs = document.querySelectorAll('input[name="specialist"]');
    specialistRadioInputs.forEach(input => {
        input.addEventListener('change', () => {
            specialistRadioInputs.forEach(radio => {
                const label = radio.closest('label');
                if (label) {
                    label.classList.remove('border-electric-cyan', 'bg-electric-cyan/5', 'shadow-md');
                    label.classList.add('border-outline-variant');
                }
            });

            if (input.checked) {
                const activeLabel = input.closest('label');
                if (activeLabel) {
                    activeLabel.classList.add('border-electric-cyan', 'bg-electric-cyan/5', 'shadow-md');
                    activeLabel.classList.remove('border-outline-variant');
                }
            }
        });
    });

    // ----------------------------------------------------
    // 4. Calendar Interactions & API Time Slots Fetching
    // ----------------------------------------------------

    /**
     * Fetches available slots from backend Express server for the selected Date, Service, and Specialist.
     */
    async function fetchAvailableSlots() {
        const date = dateInput.value;
        const service = document.querySelector('input[name="service"]:checked')?.value;
        const specialist = document.querySelector('input[name="specialist"]:checked')?.value;

        if (!date || !service || !specialist) {
            slotsContainer.innerHTML = `<span class="text-sm text-error italic">Please select service and specialist first.</span>`;
            return;
        }

        // Show loading state
        slotsContainer.innerHTML = `
            <div class="flex items-center gap-2 text-on-surface-variant text-sm py-2">
                <span class="animate-spin material-symbols-outlined text-deep-teal">sync</span>
                <span>Fetching available clinical slots...</span>
            </div>
        `;
        timeInput.value = ''; // Reset slot selection

        try {
            const response = await fetch(`/api/available-slots?date=${date}&specialist=${specialist}&service=${service}`);
            if (!response.ok) {
                throw new Error('Failed to load slots');
            }
            const data = await response.json();
            
            // Set service duration indicator
            durationIndicator.innerText = `Duration: ${SERVICE_DURATIONS_MINUTES[service] || data.duration + 'm'}`;

            if (!data.slots || data.slots.length === 0) {
                slotsContainer.innerHTML = `<span class="text-sm text-error italic">No slots available for this date.</span>`;
                return;
            }

            // Render slots
            slotsContainer.innerHTML = '';
            data.slots.forEach(slot => {
                const btn = document.createElement('button');
                btn.type = 'button';
                
                if (slot.available) {
                    // Available slot style (Hoverable pill)
                    btn.className = 'px-4 py-2 border border-outline-variant rounded-full text-sm hover:bg-primary hover:text-white transition-all slot-btn';
                    btn.innerText = slot.time;
                    btn.setAttribute('data-time', slot.time);

                    // Add click event for slot selection
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.slot-btn').forEach(b => {
                            b.className = 'px-4 py-2 border border-outline-variant rounded-full text-sm hover:bg-primary hover:text-white transition-all slot-btn';
                        });
                        btn.className = 'px-4 py-2 border border-electric-cyan bg-electric-cyan/10 text-deep-teal rounded-full text-sm font-semibold transition-all slot-btn';
                        timeInput.value = slot.time;
                    });
                } else {
                    // Blocked/Unavailable slot style (Stripped gray and crossed-out cursor)
                    btn.className = 'px-4 py-2 border border-outline-variant bg-surface-container-low text-on-surface-variant/40 rounded-full text-sm cursor-not-allowed line-through';
                    btn.innerText = slot.time;
                    btn.disabled = true;
                    btn.setAttribute('title', slot.reason || 'Unavailable');
                }
                slotsContainer.appendChild(btn);
            });

        } catch (err) {
            console.error('Error fetching available slots:', err);
            slotsContainer.innerHTML = `<span class="text-sm text-error italic">Failed to load available times. Please refresh or try again.</span>`;
        }
    }

    // Connect calendar day buttons to slot triggers
    const calendarDays = document.querySelectorAll('#calendar-days-wrapper button[data-date]');
    calendarDays.forEach(day => {
        day.addEventListener('click', (e) => {
            // Deselect all active days
            calendarDays.forEach(btn => {
                btn.className = 'p-3 rounded-lg text-label-md hover:bg-electric-cyan/20 transition-colors';
            });

            // Highlight selected day
            e.currentTarget.className = 'p-3 rounded-lg text-label-md bg-primary text-white shadow-lg';
            
            // Set date value state
            const clickedDate = e.currentTarget.getAttribute('data-date');
            dateInput.value = clickedDate;

            // Trigger slots reload
            fetchAvailableSlots();
        });
    });

    // ----------------------------------------------------
    // 5. Form Validation & Navigation Handlers
    // ----------------------------------------------------
    nextBtn.addEventListener('click', async () => {
        // Step 1 Check
        if (currentStep === 1) {
            const selectedService = document.querySelector('input[name="service"]:checked');
            if (!selectedService) {
                alert('Please select a dental service to proceed.');
                return;
            }
        }

        // Step 2 Check
        if (currentStep === 2) {
            const selectedDoc = document.querySelector('input[name="specialist"]:checked');
            if (!selectedDoc) {
                alert('Please select a clinical specialist.');
                return;
            }
            // Trigger slots fetch automatically when moving to Step 3
            fetchAvailableSlots();
        }

        // Step 3 Check
        if (currentStep === 3) {
            if (!dateInput.value) {
                alert('Please select a date on the calendar.');
                return;
            }
            if (!timeInput.value) {
                alert('Please select an available time slot.');
                return;
            }
        }

        // Navigate forward or submit final booking payload
        if (currentStep < totalSteps) {
            currentStep++;
            updateForm();
        } else {
            // Final step submission: client validation
            const patientName = document.querySelector('input[placeholder="John Doe"]').value.trim();
            const patientEmail = document.querySelector('input[placeholder="john@example.com"]').value.trim();
            const patientPhone = document.querySelector('input[placeholder="+1 (555) 000-0000"]').value.trim();
            const notes = document.querySelector('textarea[placeholder="Briefly describe your concern..."]').value.trim();

            if (!patientName || !patientEmail || !patientPhone) {
                alert('Please fill out all patient details (Name, Email, and Phone).');
                return;
            }

            // Lock navigation and show dynamic booking status
            nextBtn.disabled = true;
            nextBtn.innerHTML = 'Booking...';

            const payload = {
                name: patientName,
                email: patientEmail,
                phone: patientPhone,
                date: dateInput.value,
                time: timeInput.value,
                service: document.querySelector('input[name="service"]:checked').value,
                specialist: document.querySelector('input[name="specialist"]:checked').value,
                notes
            };

            try {
                // Post reservation data to express backend
                const response = await fetch('/api/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to confirm booking.');
                }

                // Show success prompt with confirmation code
                alert(`Thank you, ${patientName}!\n\nYour appointment is confirmed.\nBooking ID: ${data.bookingId}\n\n${data.message}`);
                
                // Reset form state
                if (bookingForm) {
                    bookingForm.reset();
                }
                
                // Clear highlight selections
                document.querySelectorAll('label.border-electric-cyan').forEach(label => {
                    label.classList.remove('border-electric-cyan', 'bg-electric-cyan/5', 'shadow-md');
                    label.classList.add('border-outline-variant');
                });
                
                // Return to first page
                currentStep = 1;
                updateForm();
                
            } catch (err) {
                console.error('Booking submission error:', err);
                alert(`Booking Failed: ${err.message}`);
            } finally {
                nextBtn.disabled = false;
                nextBtn.innerHTML = 'Confirm Appointment <span class="material-symbols-outlined">check_circle</span>';
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateForm();
        }
    });

    // Initialize wizard layout state
    updateForm();
});
