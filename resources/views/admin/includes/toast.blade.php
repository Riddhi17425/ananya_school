@if (session('toast_success') || session('toast_error') || session('toast_info'))
    @php
        $toastType = session('toast_success') ? 'success' : (session('toast_error') ? 'error' : 'info');
        $toastMessage = session('toast_success') ?? session('toast_error') ?? session('toast_info');
        $toastColors = [
            'success' => '#28a745',
            'error'   => '#dc3545',
            'info'    => '#17a2b8',
        ];
    @endphp

    <div id="app-toast" style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 280px;
        max-width: 380px;
        background: #fff;
        border-left: 5px solid {{ $toastColors[$toastType] }};
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    ">
        <i class="bi {{ $toastType === 'success' ? 'bi-check-circle-fill' : ($toastType === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill') }}"
           style="color: {{ $toastColors[$toastType] }}; font-size: 1.3rem;"></i>
        <span style="flex: 1; color: #333; font-size: 0.95rem;">{{ $toastMessage }}</span>
        <button onclick="document.getElementById('app-toast').remove()" style="background: none; border: none; color: #999; font-size: 1.1rem; cursor: pointer; line-height: 1;">&times;</button>
    </div>

    <script>
        (function () {
            const toast = document.getElementById('app-toast');
            if (!toast) return;

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        })();
    </script>
@endif
